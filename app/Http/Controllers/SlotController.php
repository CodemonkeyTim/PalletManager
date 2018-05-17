<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class SlotController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        
    }

    public function searchSlots(Request $req) {
    	$searchTerm = $req->input("searchTerm");

    	$pallets = \App\Pallet::where("productName", "LIKE", "%" . $searchTerm . "%")->get();

    	$slots = [];

    	foreach($pallets as $pallet) {
    		$slots[] = $pallet->slot;
    	}

    	foreach($slots as $slot) {
    		$palletData = $slot->pallet;

    		$slot["pallet"] = $palletData;
    	}

    	return response()->json($slots);
    }

    public function removePalletFromSlot(Request $req, $slotId) {
        $slot = \App\Slot::where("id", "=", $slotId)->first();

        if (!$slot) {
            return response()->json(["msg" => "No slot found with given id"], 404);
        }

        $pallet = $slot->pallet;

        if (!$pallet) {
            return response()->json(["msg" => "No pallet in given slot, can't remove anything."], 409);  
        }

        $slot->delete();
        $pallet->delete();

        return response()->json(["msg" => "Pallet removed from slot"]);
    }

    public function insertPalletToSlot(Request $req) {
        $palletData = $req->input("pallet");

        $slot = new \App\Slot();
        $slot->location = $palletData["warehouseSlot"];
        $slot->save();

        $pallet = new \App\Pallet();
        $pallet->productName = $palletData["productName"];
        $pallet->productCount = $palletData["productCount"];
        $pallet->dateInserted = $palletData["dateInserted"];
        $pallet->notes = $palletData["notes"];
        $slot->pallet()->save($pallet);

        return response()->json(["msg" => "Pallet inserted to slot"]);   
    }

    public function exportSlots(Request $req) {
        $slots = \App\Slot::where("id", ">", "0")->with("pallet")->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', "Sijainti");
        $sheet->setCellValue('B1', "Tuote");
        $sheet->setCellValue('C1', "Lukumäärä");
        $sheet->setCellValue('D1', "Syöttö-pvm");
        $sheet->setCellValue('E1', "Muistiinpanoja");

        $rowIndex = 2;

        foreach($slots as $slot) {
            $pallet = $slot->pallet;

            $sheet->setCellValue('A' . $rowIndex, $slot->location);

            if ($pallet) {
                $sheet->setCellValue('B' . $rowIndex, $pallet->productName);
                $sheet->setCellValue('C' . $rowIndex, $pallet->productCount);
                $sheet->setCellValue('D' . $rowIndex, $pallet->dateInserted);
                $sheet->setCellValue('E' . $rowIndex, $pallet->notes);
            }

            $rowIndex++;
        }

        $timestamp = date('dmY_Hi');
        $filename = 'varasto_' . $timestamp . '.xlsx';

        $writer = new Xlsx($spreadsheet);
        $writer->save($filename);

        register_shutdown_function('unlink', $filename); // Removes the file after request is handled

        return response()->download($filename)->deleteFileAfterSend(true);
    }
}