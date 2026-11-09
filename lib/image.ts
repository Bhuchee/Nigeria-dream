export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const mx = 1024;
      let { width: w, height: h } = img;
      if (w > h && w > mx) { h = (h * mx) / w; w = mx; }
      else if (h > w && h > mx) { w = (w * mx) / h; h = mx; }
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function processDataUrl(du: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const mx = 1024;
      let { width: w, height: h } = img;
      if (w > h && w > mx) { h = (h * mx) / w; w = mx; }
      else if (h > w && h > mx) { w = (w * mx) / h; h = mx; }
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = du;
  });
}

export function captureFromCamera(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const v = document.createElement("video");
      v.srcObject = new MediaStream([track]);
      v.play();
      v.onloadedmetadata = () => {
        const c = document.createElement("canvas");
        c.width = v.videoWidth; c.height = v.videoHeight;
        v.onseeked = () => {
          c.getContext("2d")!.drawImage(v, 0, 0);
          resolve(c.toDataURL("image/jpeg", 0.8));
          track.stop();
          stream.getTracks().forEach((t) => t.stop());
        };
        v.currentTime = 0;
      };
      v.onerror = reject;
    } catch (e) { reject(e); }
  });
}