#!/usr/bin/env python3
"""
png2webp.py — Convierte PNGs a WebP con salto si ya existe.

Uso básico:
  python png2webp.py carpetaX carpetaY

Opciones:
  --quality 85        Calidad (0-100) para WebP con pérdida (por defecto: 85)
  --lossless          Compresión sin pérdida (ignora --quality)
  -r, --recursive     Procesa subcarpetas recursivamente
  --update            Reconvierte solo si el PNG es más nuevo que el WebP existente
  -o, --overwrite     Sobrescribe siempre si el .webp ya existe (incompatible con --update)
"""
import argparse
from pathlib import Path
from PIL import Image
import sys
import os

def list_pngs(root: Path, recursive: bool):
    if recursive:
        return [p for p in root.rglob("*.png") if p.is_file()]
    return [p for p in root.glob("*.png") if p.is_file()]

def should_process(src: Path, dst: Path, update: bool, overwrite: bool):
    if not dst.exists():
        return True, "new"         # no existe: hay que crear
    if overwrite:
        return True, "overwrite"   # forzar
    if update:
        try:
            src_mtime = src.stat().st_mtime
            dst_mtime = dst.stat().st_mtime
            if src_mtime > dst_mtime:
                return True, "update"  # origen más nuevo
            else:
                return False, "skip-up-to-date"
        except Exception:
            # si falla el stat, mejor no tocar
            return False, "skip-exists"
    # por defecto: si existe y no hay flags, saltar
    return False, "skip-exists"

def convert_one(src: Path, dst: Path, *, quality: int, lossless: bool):
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im.load()
        if im.mode in ("P", "PA", "LA"):
            im = im.convert("RGBA")
        elif im.mode == "1":
            im = im.convert("L")

        save_kwargs = {
            "format": "WEBP",
            "method": 6,
            "icc_profile": im.info.get("icc_profile"),
            "exact": True
        }
        if lossless:
            save_kwargs["lossless"] = True
        else:
            save_kwargs["quality"] = quality

        im.save(dst, **save_kwargs)

def main():
    parser = argparse.ArgumentParser(description="Convierte todos los PNG de una carpeta a WebP.")
    parser.add_argument("input_dir", type=Path, help="Carpeta de entrada (PNG)")
    parser.add_argument("output_dir", type=Path, help="Carpeta de salida (WebP)")
    parser.add_argument("--quality", type=int, default=85, help="Calidad WebP (0-100) si no es lossless")
    parser.add_argument("--lossless", action="store_true", help="Usar compresión sin pérdida")
    parser.add_argument("-r", "--recursive", action="store_true", help="Procesar subcarpetas")
    parser.add_argument("--update", action="store_true", help="Solo reconvertir si el PNG es más nuevo que el WebP")
    parser.add_argument("-o", "--overwrite", action="store_true", help="Sobrescribir archivos existentes")
    args = parser.parse_args()

    if args.update and args.overwrite:
        print("No puedes usar --update y --overwrite a la vez.")
        sys.exit(1)

    if not args.input_dir.exists() or not args.input_dir.is_dir():
        print("La carpeta de entrada no existe o no es un directorio.")
        sys.exit(1)

    if not args.lossless and not (0 <= args.quality <= 100):
        print("La calidad debe estar entre 0 y 100.")
        sys.exit(1)

    pngs = list_pngs(args.input_dir, args.recursive)
    if not pngs:
        print("No se encontraron PNGs en la carpeta de entrada.")
        sys.exit(0)

    total = ok = skipped = updated = overwritten = 0
    for src in pngs:
        rel = src.relative_to(args.input_dir)
        dst = (args.output_dir / rel).with_suffix(".webp")

        doit, reason = should_process(src, dst, args.update, args.overwrite)
        if not doit:
            skipped += 1
            if reason == "skip-up-to-date":
                print(f"[SKIP] {dst} (actualizado)")
            else:
                print(f"[SKIP] {dst} (ya existe)")
            continue

        try:
            convert_one(src, dst, quality=args.quality, lossless=args.lossless)
            if reason == "overwrite":
                overwritten += 1
                print(f"[OVERWRITE] {src} -> {dst}")
            elif reason == "update":
                updated += 1
                print(f"[UPDATE] {src} -> {dst}")
            else:
                ok += 1
                print(f"[OK] {src} -> {dst}")
        except Exception as e:
            print(f"[ERROR] {src}: {e}")

    print(f"\nResumen: {ok} nuevos, {updated} actualizados, {overwritten} sobrescritos, {skipped} omitidos, de {total:=d} archivos en total.".replace("total", str(len(pngs))))
    # Nota: total mostrado es la longitud de pngs para claridad.

if __name__ == "__main__":
    main()
