#!/usr/bin/env python3
"""
png2avif.py — Convierte PNGs a AVIF con salto si ya existe.

Uso:
  python png2avif.py carpetaPNG carpetaAVIF

Opciones:
  --quality 80        Calidad (0-100) para AVIF con pérdida (por defecto: 80)
  --effort 4          Esfuerzo de codificación (0-9). Más alto = más lento y más pequeño.
  --lossless          Compresión sin pérdida (ignora --quality)
  -r, --recursive     Procesa subcarpetas recursivamente
  --update            Reconvierte solo si el PNG es más nuevo que el AVIF existente
  -o, --overwrite     Sobrescribe siempre si el .avif ya existe (incompatible con --update)
"""

import argparse
from pathlib import Path
from PIL import Image
import sys

def list_pngs(root: Path, recursive: bool):
    if recursive:
        return [p for p in root.rglob("*.png") if p.is_file()]
    return [p for p in root.glob("*.png") if p.is_file()]

def should_process(src: Path, dst: Path, update: bool, overwrite: bool):
    if not dst.exists():
        return True, "new"
    if overwrite:
        return True, "overwrite"
    if update:
        try:
            return (src.stat().st_mtime > dst.stat().st_mtime), "update"
        except Exception:
            return False, "skip-exists"
    return False, "skip-exists"

def convert_one(src: Path, dst: Path, *, quality: int, effort: int, lossless: bool):
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im.load()

        # Normaliza modos problemáticos para preservar transparencia y evitar artefactos
        if im.mode in ("P", "PA", "LA"):
            im = im.convert("RGBA")
        elif im.mode == "1":
            im = im.convert("L")

        save_kwargs = {
            "format": "AVIF",
            "icc_profile": im.info.get("icc_profile"),
            "effort": effort
        }
        if lossless:
            save_kwargs["lossless"] = True
        else:
            save_kwargs["quality"] = quality  # 0–100 (más alto = mejor)

        im.save(dst, **save_kwargs)

def main():
    parser = argparse.ArgumentParser(description="Convierte todos los PNG de una carpeta a AVIF.")
    parser.add_argument("input_dir", type=Path, help="Carpeta de entrada (PNG)")
    parser.add_argument("output_dir", type=Path, help="Carpeta de salida (AVIF)")
    parser.add_argument("--quality", type=int, default=80, help="Calidad AVIF (0-100) si no es lossless")
    parser.add_argument("--effort", type=int, default=4, help="Esfuerzo de compresión AVIF (0-9)")
    parser.add_argument("--lossless", action="store_true", help="Usar compresión sin pérdida")
    parser.add_argument("-r", "--recursive", action="store_true", help="Procesar subcarpetas")
    parser.add_argument("--update", action="store_true", help="Solo reconvertir si el PNG es más nuevo que el AVIF")
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

    if not (0 <= args.effort <= 9):
        print("El esfuerzo debe estar entre 0 y 9.")
        sys.exit(1)

    pngs = list_pngs(args.input_dir, args.recursive)
    if not pngs:
        print("No se encontraron PNGs en la carpeta de entrada.")
        sys.exit(0)

    ok = skipped = updated = overwritten = 0
    for src in pngs:
        rel = src.relative_to(args.input_dir)
        dst = (args.output_dir / rel).with_suffix(".avif")

        doit, reason = should_process(src, dst, args.update, args.overwrite)
        if not doit:
            skipped += 1
            print(f"[SKIP] {dst} (ya existe o actualizado)")
            continue

        try:
            convert_one(src, dst, quality=args.quality, effort=args.effort, lossless=args.lossless)
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

    total = len(pngs)
    print(f"\nResumen: {ok} nuevos, {updated} actualizados, {overwritten} sobrescritos, {skipped} omitidos, de {total} archivos en total.")

if __name__ == "__main__":
    main()
