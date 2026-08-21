# TVETMARA Digital Signage V1.0

## Fungsi V1.0
- Frame/header/footer statik
- Logo kolej
- Jam & tarikh live
- Poster auto-slide setiap 10 saat
- Loop tanpa henti
- Senarai poster dikawal melalui `posters.json`
- Poster yang salah nama / missing akan di-skip automatik
- Jika semua poster gagal atau senarai kosong, fallback message dipaparkan
- Cache-busting asas untuk `posters.json` dan imej poster

## Cara tukar poster
1. Upload gambar baru ke `assets/posters/`
2. Buka `posters.json`
3. Tambah path poster, contoh:
   `"assets/posters/poster-hari-tvet.jpg"`
4. Save / commit

## Cara keluarkan poster daripada rotation
Buang sahaja line poster daripada `posters.json`.

Fail poster boleh kekal dalam `assets/posters/` untuk digunakan semula kemudian.

## Tukar tempoh paparan
Dalam `script.js`, ubah:
`const POSTER_DURATION = 10000;`

Nilai dalam millisecond:
- 5000 = 5 saat
- 10000 = 10 saat
- 15000 = 15 saat

## Logo
Gantikan `assets/logo.png` dengan logo sebenar kolej.
Sebaiknya guna PNG transparent.

## GitHub Pages
Upload semua fail/folder ke repository GitHub.
Kemudian aktifkan GitHub Pages pada branch utama.
TV hanya perlu buka URL GitHub Pages tersebut.
