<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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

    	$pallets = \App\Pallet::where("productName", "like", "%" . $searchTerm . "%")->limit(10)->get();

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
}