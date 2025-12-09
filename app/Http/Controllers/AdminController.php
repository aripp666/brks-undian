<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Peserta;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Halaman dashboard admin
    public function index()
    {
        return Inertia::render('Admin/Dashboard');
    }

    // API untuk mengambil data peserta
    public function peserta()
    {
        $peserta = Peserta::orderBy('created_at', 'desc')->get();
        return response()->json($peserta);
    }

        // API untuk mengacak peserta dan pilih pemenang
    public function acakUndian()
    {
        // Ambil peserta yang sudah diverifikasi dan belum menang
        $peserta = Peserta::where('is_verified', true)
                        ->where('is_winner', false)
                        ->inRandomOrder()
                        ->first();

        if (!$peserta) {
            return response()->json([
                'status' => false,
                'message' => 'Belum ada peserta yang diverifikasi atau semua sudah menang.'
            ]);
        }

        // Tandai sebagai pemenang
        $peserta->is_winner = true;
        $peserta->save();

        return response()->json([
            'status' => true,
            'pemenang' => $peserta
        ]);
    }
        public function reset()
{
    Peserta::query()->update(['is_winner' => false]);
    return response()->json(['status' => true, 'message' => 'Pemenang berhasil direset']);
}


}
