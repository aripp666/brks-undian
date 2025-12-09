<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Peserta;
use Inertia\Inertia;

class UndianController extends Controller
{
    // NORMALISASI NOMOR
    private function normalizePhone($nomor)
    {
        $nomor = preg_replace('/[^0-9]/', '', $nomor);

        if (substr($nomor, 0, 1) === '0') {
            return '62' . substr($nomor, 1);
        }

        if (substr($nomor, 0, 2) === '62') {
            return $nomor;
        }

        return '62' . $nomor;
    }

    // =============================
    // HALAMAN UTAMA
    // =============================
    public function index()
    {
        return Inertia::render('RegisterUndian');
    }

    // =============================
    // KIRIM OTP
    // =============================
    public function sendOtp(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'whatsapp' => 'required'
        ]);

        $whatsapp = $this->normalizePhone($request->whatsapp);

        // Cari peserta berdasarkan nomor WA
        $peserta = Peserta::where('whatsapp', $whatsapp)->first();

        // Jika sudah terverifikasi, maka tidak boleh daftar lagi
        if ($peserta && $peserta->is_verified) {
            return back()->with('error', 'Nomor ini sudah terdaftar & terverifikasi!');
        }

        // Jika nomor sudah ada tetapi nama beda → TOLAK
        if ($peserta && $peserta->nama !== $request->nama) {
            return back()->with('error', 'Nama tidak sesuai dengan nomor WhatsApp yang pernah didaftarkan.');
        }

        // Generate OTP
        $otp = rand(100000, 999999);

        // Jika belum ada → buat baru
        if (!$peserta) {
            $peserta = Peserta::create([
                'nama' => $request->nama,
                'whatsapp' => $whatsapp,
                'otp' => $otp,
                'is_verified' => false,
            ]);
        } else {
            // Jika sudah ada tapi belum verifikasi → update OTP
            $peserta->update(['otp' => $otp]);
        }

        // =============================
        // KIRIM OTP via FONNTE
        // =============================
        $token = env('FONNTE_TOKEN');

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.fonnte.com/send",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => [
                'target' => $whatsapp,
                'message' => "Kode OTP Anda: *$otp*\nJangan bagikan kepada siapapun."
            ],
            CURLOPT_HTTPHEADER => [
                "Authorization: $token"
            ],
        ]);

        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);

        // Jika API Fonnte error
        if ($error) {
            return back()->with('error', "Gagal mengirim OTP: CURL ERROR → $error");
        }

        // Decode untuk cek status Fonnte
        $result = json_decode($response, true);

        if (!isset($result['status']) || $result['status'] !== true) {
            return back()->with('error', "OTP gagal dikirim (FONNTE ERROR): " . ($result['reason'] ?? 'Tidak diketahui'));
        }

        return back()->with('status', 'OTP berhasil dikirim! Silakan cek WhatsApp Anda.');
    }

    // =============================
    // VERIFIKASI OTP
    // =============================
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'whatsapp' => 'required',
            'otp' => 'required'
        ]);

        $whatsapp = $this->normalizePhone($request->whatsapp);

        $peserta = Peserta::where('whatsapp', $whatsapp)->first();

        if (!$peserta || $peserta->otp != $request->otp) {
            return back()->with('error', 'OTP salah atau sudah kadaluarsa!');
        }

        if (!$peserta->nomor_undian) {
            $last = Peserta::max('nomor_undian');
            $newNumber = str_pad((int)$last + 1, 5, '0', STR_PAD_LEFT);
            $peserta->nomor_undian = $newNumber;
        }

        $peserta->is_verified = true;
        $peserta->save();

        return back()->with('success', "Verifikasi berhasil! Nomor undian Anda: {$peserta->nomor_undian}");
    }

    // =============================
    // CEK NOMOR UNDIAN
    // =============================
    public function cekUndian(Request $request)
    {
        $request->validate([
            'whatsapp' => 'required'
        ]);

        $whatsapp = $this->normalizePhone($request->whatsapp);

        $peserta = Peserta::where('whatsapp', $whatsapp)->first();

        if (!$peserta) {
            return back()->with('error', 'Nomor WhatsApp ini belum pernah terdaftar.');
        }

        if (!$peserta->is_verified) {
            return back()->with('error', 'Nomor ini belum diverifikasi. Silakan cek OTP.');
        }

        return back()->with('success', "Nomor Undian Anda: {$peserta->nomor_undian}");
    }


}
