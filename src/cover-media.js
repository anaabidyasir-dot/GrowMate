// Keep cover media out of localStorage so other account data stays small.
export async function compressCover(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file?.type)) {
    throw new Error('Gunakan gambar JPG, PNG, atau WebP.');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Ukuran sampul maksimal 8 MB.');
  }
  const objectUrl = URL.createObjectURL(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gambar tidak dapat dibaca.'));
    img.src = objectUrl;
  }).finally(() => URL.revokeObjectURL(objectUrl));

  const width = Math.min(1600, image.naturalWidth);
  const height = Math.round(image.naturalHeight * width / image.naturalWidth);
  if (!width || !height || width * height > 15_000_000) {
    throw new Error('Resolusi gambar tidak didukung.');
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Gagal memproses sampul.')), 'image/jpeg', 0.82);
  });
}
