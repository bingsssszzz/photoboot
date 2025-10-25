const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const countdownEl = document.getElementById('countdown');

const captureButton = document.getElementById('capture');
const retakeButton = document.getElementById('retake');
const saveButton = document.getElementById('save');

let currentFilter = 'none';
let frame = new Image();
frame.src = 'frame.png'; // Ganti dengan frame PNG transparan
let stream;

// 🔹 Aktifkan kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(s => {
    stream = s;
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    alert("Tidak bisa mengakses kamera: " + err);
  });

// 🔹 Ganti filter
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    video.style.filter = currentFilter; // tampilkan efek langsung di video
  });
});

// 🔹 Countdown sebelum ambil foto
function startCountdown() {
  let count = 3;
  countdownEl.textContent = count;

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(timer);
      countdownEl.textContent = '';
      takePhoto();
    }
  }, 1000);
}

// 🔹 Ambil foto dari video
function takePhoto() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.filter = currentFilter;

  // Gambar video dulu
    context.save();                 // Simpan state awal
    context.scale(-1, 1);           // Balik horizontal
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); 
    context.restore();  
  // Gambar frame di atas video (tidak menutupi hasil)
  if (frame.complete) {
    context.drawImage(frame, 0, 0, canvas.width, canvas.height);
  } else {
    frame.onload = () => {
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    };
  }

  // Simpan hasilnya ke <img>
  photo.src = canvas.toDataURL('image/png');

  // Sembunyikan video, aktifkan tombol
  video.style.display = 'none';
  retakeButton.disabled = false;
  saveButton.disabled = false;
}

// 🔹 Tombol Ambil Foto
captureButton.addEventListener('click', () => {
  captureButton.disabled = true;
  startCountdown();
});

// 🔹 Tombol Ambil Ulang
retakeButton.addEventListener('click', () => {
  video.style.display = 'block';
  photo.src = '';
  captureButton.disabled = false;
  retakeButton.disabled = true;
  saveButton.disabled = true;
});

// 🔹 Simpan hasil foto
saveButton.addEventListener('click', () => {
  if (!photo.src) {
    alert("Ambil foto dulu kocak");
    return;
  }

  const a = document.createElement('a');
  a.href = photo.src;
  a.download = 'foto_booth.png';
  a.click();
});
