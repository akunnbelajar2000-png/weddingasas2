// NAMA TAMU DARI URL
const parameter = new URLSearchParams(window.location.search);
const tamu = parameter.get("to");

document.getElementById("namaTamu").textContent =
    tamu ? tamu.replace(/\+/g, " ") : "Tamu Undangan";

// BUKA UNDANGAN
function bukaUndangan() {
    document.getElementById("cover").style.display = "none";
    document.getElementById("isiUndangan").style.display = "block";

    document.getElementById("musik").play().catch(() => {});
}

// COUNTDOWN
const tanggalAcara = new Date("2027-04-17T10:00:00").getTime();

function hitungMundur() {
    const sekarang = new Date().getTime();
    const selisih = tanggalAcara - sekarang;

    if (selisih <= 0) {
        document.getElementById("hari").textContent = 0;
        document.getElementById("jam").textContent = 0;
        document.getElementById("menit").textContent = 0;
        document.getElementById("detik").textContent = 0;
        return;
    }

    document.getElementById("hari").textContent =
        Math.floor(selisih / (1000 * 60 * 60 * 24));

    document.getElementById("jam").textContent =
        Math.floor((selisih / (1000 * 60 * 60)) % 24);

    document.getElementById("menit").textContent =
        Math.floor((selisih / (1000 * 60)) % 60);

    document.getElementById("detik").textContent =
        Math.floor((selisih / 1000) % 60);
}

hitungMundur();
setInterval(hitungMundur, 1000);

// MUSIK
function toggleMusik() {
    const musik = document.getElementById("musik");
    const tombol = document.getElementById("musicBtn");

    if (musik.paused) {
        musik.play();
        tombol.textContent = "♫";
    } else {
        musik.pause();
        tombol.textContent = "▶";
    }
}

// SALIN REKENING
function salinRekening() {
    const rekening = document.getElementById("rekening").textContent;

    navigator.clipboard.writeText(rekening)
        .then(() => alert("Nomor rekening berhasil disalin!"))
        .catch(() => alert("Gagal menyalin nomor rekening."));
}

// SIMPAN KALENDER
function simpanKalender() {
    const isi =
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Pernikahan Bayu & Rani
DTSTART:20270417T030000Z
DTEND:20270417T060000Z
LOCATION:Gedung Pernikahan
DESCRIPTION:Undangan Pernikahan Bayu & Rani
END:VEVENT
END:VCALENDAR`;

    const file = new Blob([isi], {
        type: "text/calendar"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "undangan-bayu-rani.ics";
    link.click();

    URL.revokeObjectURL(link.href);
}

// RSVP DAN BUKU TAMU
const form = document.getElementById("formRSVP");
const daftar = document.getElementById("daftarUcapan");

let dataUcapan = JSON.parse(
    localStorage.getItem("ucapanPernikahan") || "[]"
);

function tampilkanUcapan() {
    daftar.innerHTML = "";

    dataUcapan.forEach(function(data) {
        const item = document.createElement("div");
        item.className = "ucapan-item";

        const nama = document.createElement("h4");
        nama.textContent = data.nama;

        const status = document.createElement("p");
        status.textContent = "Kehadiran: " + data.status;

        const pesan = document.createElement("p");
        pesan.textContent = data.ucapan;

        item.append(nama, status, pesan);
        daftar.appendChild(item);
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        nama: document.getElementById("nama").value,
        status: document.getElementById("status").value,
        ucapan: document.getElementById("ucapan").value
    };

    dataUcapan.unshift(data);

    localStorage.setItem(
        "ucapanPernikahan",
        JSON.stringify(dataUcapan)
    );

    tampilkanUcapan();
    form.reset();

    alert("Terima kasih atas ucapan Anda!");
});

tampilkanUcapan();