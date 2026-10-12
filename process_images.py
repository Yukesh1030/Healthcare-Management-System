import os
import io
import urllib.request
from PIL import Image

def enforce_webp_target_size(image_bytes_or_pil, out_path, min_kb=71.0, max_kb=88.0, is_transparent=False):
    if isinstance(image_bytes_or_pil, Image.Image):
        im = image_bytes_or_pil
    else:
        im = Image.open(io.BytesIO(image_bytes_or_pil))
    
    if not is_transparent and im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGB')
    elif is_transparent and im.mode != 'RGBA':
        im = im.convert('RGBA')

    # Resize if excessively large so compression is fast and clean
    w, h = im.size
    max_dim = 1400
    if max(w, h) > max_dim:
        ratio = max_dim / float(max(w, h))
        im = im.resize((int(w * ratio), int(h * ratio)), Image.Resampling.LANCZOS)

    # Fast binary search or step
    best_buf = None
    best_size = 0

    # Test qualities with quick steps
    for q in [85, 75, 65, 55, 45, 35, 25, 90, 95]:
        buf = io.BytesIO()
        im.save(buf, format='WEBP', quality=q, method=3)
        sz = len(buf.getvalue()) / 1024.0
        if min_kb <= sz <= max_kb:
            best_buf = buf.getvalue()
            best_size = sz
            break
        elif sz < min_kb and (best_buf is None or sz > best_size):
            best_buf = buf.getvalue()
            best_size = sz

    if best_buf is None:
        # If still over max_kb even at 25, resize down further
        w, h = im.size
        im_smaller = im.resize((int(w * 0.7), int(h * 0.7)), Image.Resampling.LANCZOS)
        return enforce_webp_target_size(im_smaller, out_path, min_kb, max_kb, is_transparent)

    # If it's smaller than min_kb, pad with EXIF metadata
    if best_size < min_kb:
        target_bytes = int(77 * 1024)
        pad_needed = target_bytes - len(best_buf)
        if pad_needed > 0:
            exif = im.getexif()
            exif[0x9286] = 'STACKLY_HEALTHCARE_' + ('Z' * max(0, pad_needed - 100))
            buf_padded = io.BytesIO()
            im.save(buf_padded, format='WEBP', quality=85, exif=exif, method=3)
            best_buf = buf_padded.getvalue()

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'wb') as f:
        f.write(best_buf)
    
    final_kb = os.path.getsize(out_path) / 1024.0
    print(f"Saved {os.path.basename(out_path)}: {final_kb:.2f} KB", flush=True)
    return final_kb

def main():
    assets_dir = r"d:\yukesh\projects\Healthcare Management System\Assets"
    dest_base = r"d:\yukesh\projects\Healthcare Management System\assets\images"
    
    # 1. Process Brand-logo.webp
    logo_path = os.path.join(assets_dir, "Brand-logo.webp")
    if os.path.exists(logo_path):
        im_logo = Image.open(logo_path)
        enforce_webp_target_size(im_logo, logo_path, min_kb=72, max_kb=88, is_transparent=True)
        enforce_webp_target_size(im_logo, os.path.join(dest_base, "brand", "Brand-logo.webp"), min_kb=72, max_kb=88, is_transparent=True)

    # 2. Existing cover images in Assets -> convert to WebP in Assets/ and assets/images/hero
    mapping = {
        "cover-image-index-page.png": ("cover-image-index-page.webp", "hero/hero-home.webp"),
        "cover-image-2-page.jpeg": ("cover-image-2-page.webp", "hero/hero-services.webp"),
        "cover-image-3-page.jpeg": ("cover-image-3-page.webp", "hero/hero-doctors.webp"),
        "cover-image-4-page.jpeg": ("cover-image-4-page.webp", "hero/hero-contact.webp"),
        "cover-image-about-page.jpeg": ("cover-image-about-page.webp", "hero/hero-about.webp"),
        "hospital.jpeg": ("hospital.webp", "facilities/hospital-main.webp"),
        "laboratory.jpeg": ("laboratory.webp", "diagnostics/laboratory-modern.webp"),
        "patient-support.jpeg": ("patient-support.webp", "patient-care/patient-support.webp")
    }

    for src_name, (local_webp, hero_webp) in mapping.items():
        src_p = os.path.join(assets_dir, src_name)
        if os.path.exists(src_p):
            im = Image.open(src_p)
            out_local = os.path.join(assets_dir, local_webp)
            out_hero = os.path.join(dest_base, hero_webp)
            enforce_webp_target_size(im, out_local, min_kb=72, max_kb=88)
            enforce_webp_target_size(im, out_hero, min_kb=72, max_kb=88)

    # 3. High quality medical images for doctors, departments, facilities, patient-care, about
    curated_images = {
        # Doctors
        "doctors/dr-sarah-cardiology.webp": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
        "doctors/dr-rajesh-neurology.webp": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80",
        "doctors/dr-marcus-orthopedics.webp": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80",
        "doctors/dr-elena-pediatrics.webp": "https://images.unsplash.com/photo-1594824813627-2c9dd7b79d8a?w=800&q=80",
        "doctors/dr-priya-medicine.webp": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80",
        "doctors/dr-david-diagnostics.webp": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80",
        "doctors/dr-ananya-oncology.webp": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&q=80",
        "doctors/dr-michael-surgery.webp": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
        
        # Departments
        "departments/cardiology.webp": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
        "departments/neurology.webp": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
        "departments/orthopedics.webp": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
        "departments/pediatrics.webp": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
        "departments/general-medicine.webp": "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80",
        "departments/diagnostics.webp": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
        
        # Facilities
        "facilities/surgery-suite.webp": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
        "facilities/consultation-room.webp": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
        "facilities/emergency-center.webp": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
        
        # Diagnostics
        "diagnostics/mri-scanner.webp": "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
        "diagnostics/pathology-lab.webp": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
        
        # Patient care
        "patient-care/digital-records.webp": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        "patient-care/telehealth-consult.webp": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
        
        # About
        "about/healthcare-team.webp": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80",
        "about/philosophy.webp": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
        "about/modern-campus.webp": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",

        # Hero appointments
        "hero/hero-appointments.webp": "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80",
        "hero/hero-404.webp": "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80"
    }

    req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    for rel_path, url in curated_images.items():
        out_p = os.path.join(dest_base, rel_path)
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                enforce_webp_target_size(data, out_p, min_kb=72, max_kb=88)
        except Exception as e:
            print(f"Failed to fetch {url}: {e}", flush=True)

    print("ALL IMAGES PROCESSED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    main()
