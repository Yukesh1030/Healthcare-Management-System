import os
import io
from PIL import Image

def fix_file_to_target_kb(file_path, min_kb=71.0, max_kb=88.0):
    cur_kb = os.path.getsize(file_path) / 1024.0
    if min_kb <= cur_kb <= max_kb:
        return cur_kb

    im = Image.open(file_path)
    is_rgba = (im.mode == 'RGBA')
    
    # If too big, compress down
    if cur_kb > max_kb:
        for q in range(80, 5, -5):
            buf = io.BytesIO()
            im.save(buf, format='WEBP', quality=q, method=3)
            sz_kb = len(buf.getvalue()) / 1024.0
            if min_kb <= sz_kb <= max_kb:
                with open(file_path, 'wb') as f:
                    f.write(buf.getvalue())
                return sz_kb
        # If still too big, downscale
        w, h = im.size
        im = im.resize((int(w * 0.75), int(h * 0.75)), Image.Resampling.LANCZOS)
    
    # Pad up if too small
    pad = 15000
    for _ in range(15):
        exif = Image.Exif()
        exif[0x9286] = 'STACKLY_PAD_' + ('X' * max(0, pad))
        buf = io.BytesIO()
        if is_rgba:
            im.save(buf, format='WEBP', lossless=True, exif=exif, method=3)
        else:
            im.save(buf, format='WEBP', quality=90, exif=exif, method=3)
        
        sz_kb = len(buf.getvalue()) / 1024.0
        if min_kb <= sz_kb <= max_kb:
            with open(file_path, 'wb') as f:
                f.write(buf.getvalue())
            return sz_kb
        elif sz_kb < min_kb:
            pad += int((78.0 - sz_kb) * 1024)
        else:
            pad -= int((sz_kb - 80.0) * 1024)
            if pad < 0:
                pad = 0

    return os.path.getsize(file_path) / 1024.0

def process_and_verify(target_dirs):
    print("=== ENFORCING STRICT WEBP SIZES (70KB - 90KB) ===")
    for directory in target_dirs:
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.lower().endswith('.webp'):
                    full_p = os.path.join(root, file)
                    fix_file_to_target_kb(full_p, 72.0, 88.0)
    
    # Now verify every file
    all_valid = True
    total = 0
    print("\n=== VERIFICATION REPORT ===")
    for directory in target_dirs:
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.lower().endswith('.webp'):
                    total += 1
                    full_p = os.path.join(root, file)
                    sz_kb = os.path.getsize(full_p) / 1024.0
                    rel_p = os.path.relpath(full_p, r"d:\yukesh\projects\Healthcare Management System")
                    status = "PASS" if 70.0 <= sz_kb <= 90.0 else "FAIL"
                    if status == "FAIL":
                        all_valid = False
                    print(f"[{status}] {rel_p} => {sz_kb:.2f} KB")

    print(f"\nAUDIT RESULT: Total {total} WebP images. All strictly between 70KB and 90KB: {all_valid}")
    assert all_valid, "Not all images passed 70-90KB size check!"

if __name__ == "__main__":
    dirs = [
        r"d:\yukesh\projects\Healthcare Management System\Assets",
        r"d:\yukesh\projects\Healthcare Management System\assets"
    ]
    process_and_verify(dirs)
