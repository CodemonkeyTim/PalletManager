<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        
    ];

    public function pallet() {
    	return $this->hasOne("\App\Pallet");
    }
}
