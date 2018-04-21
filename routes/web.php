<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->group(["prefix" => '/api'], function () use ($router) {
	$router->get('/searchSlots', ['uses' => 'SlotController@searchSlots']);
	$router->post('/insertToSlot', ['uses' => 'SlotController@insertPalletToSlot']);
	$router->delete('/removeFromSlot/{slotId}', ['uses' => 'SlotController@removePalletFromSlot']);
	$router->get('/exportSlots', ['uses' => 'SlotController@exportSlots']);
});