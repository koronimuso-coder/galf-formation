import os
import shutil

src_dir = r"c:\Users\NYAMMA\GALF FORMATION\GALF IMAGE"
dst_dir = r"c:\Users\NYAMMA\GALF FORMATION\public\images\engins"

mapping = {
    "ChatGPT Image 24 avr. 2026, 17_33_59 (1).png": "chariot-elevateur.png",
    "ChatGPT Image 24 avr. 2026, 17_33_59 (2).png": "pelle-hydraulique.png",
    "ChatGPT Image 24 avr. 2026, 17_33_59 (3).png": "chargeuse.png",
    "ChatGPT Image 24 avr. 2026, 17_34_00 (4).png": "tractopelle.png",
    "ChatGPT Image 24 avr. 2026, 17_34_01 (5).png": "bulldozer.png",
    "ChatGPT Image 24 avr. 2026, 17_34_01 (6).png": "niveleuse.png",
    "ChatGPT Image 24 avr. 2026, 17_34_02 (7).png": "grue-mobile.png",
    "ChatGPT Image 24 avr. 2026, 17_34_02 (8).png": "tombereau-articule.png",
    "ChatGPT Image 24 avr. 2026, 17_34_04 (9).png": "forage-hydraulique.png",
    "ChatGPT Image 24 avr. 2026, 17_34_04 (10).png": "compacteur.png",
    "ChatGPT Image 24 avr. 2026, 17_44_28 (1).png": "grue-tour.png",
    "ChatGPT Image 24 avr. 2026, 17_44_28 (2).png": "grue-auxiliaire.png",
    "ChatGPT Image 24 avr. 2026, 17_44_29 (3).png": "forage-minier.png",
    "ChatGPT Image 24 avr. 2026, 17_44_29 (4).png": "sino-truck.png",
    "ChatGPT Image 24 avr. 2026, 17_46_48 (2).png": "chariot-telescopique.png"
}

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

for src_name, dst_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        print(f"Copying {src_name} to {dst_name}")
        shutil.copy2(src_path, dst_path)
    else:
        print(f"Warning: {src_path} not found")

# Headers Mapping
header_src = r"c:\Users\NYAMMA\GALF FORMATION\GALF WEBP"
header_dst = r"c:\Users\NYAMMA\GALF FORMATION\public\images\headers"

header_mapping = {
    "animate94-ezgif.com-video-to-webp-converter.webp": "apprenant.webp",
    "animate96-ezgif.com-video-to-webp-converter.webp": "entreprise.webp",
    "animate98-ezgif.com-video-to-webp-converter.webp": "contact.webp",
    "animate99-ezgif.com-video-to-webp-converter.webp": "about.webp",
    "animate-2026-04-15T170931.079-ezgif.com-video-to-webp-converter.webp": "faq.webp",
    "animate-2026-04-15T170949.508-ezgif.com-video-to-webp-converter.webp": "mediatheque.webp",
    "animate-2026-04-15T170957.065-ezgif.com-video-to-webp-converter.webp": "formations.webp",
}

if not os.path.exists(header_dst):
    os.makedirs(header_dst)

for src_name, dst_name in header_mapping.items():
    src_path = os.path.join(header_src, src_name)
    dst_path = os.path.join(header_dst, dst_name)
    if os.path.exists(src_path):
        print(f"Copying header {src_name} to {dst_name}")
        shutil.copy2(src_path, dst_path)
    else:
        print(f"Warning: {src_path} not found")
