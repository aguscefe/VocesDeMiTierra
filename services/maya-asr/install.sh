#!/usr/bin/env bash
set -euo pipefail
cd /var/www/vocesdemitierra
available=$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)
if [ "$available" -lt 6291456 ]; then
  echo "Se necesitan al menos 6 GiB disponibles para instalar este modelo sin afectar otras páginas. No se modificó el servidor."
  exit 1
fi
apt-get update
apt-get install -y python3-venv
python3 -m venv services/maya-asr/.venv
services/maya-asr/.venv/bin/pip install torch==2.6.0 --index-url https://download.pytorch.org/whl/cpu
services/maya-asr/.venv/bin/pip install -r services/maya-asr/requirements.txt
mkdir -p services/maya-asr/cache
chown -R deploy:www-data services/maya-asr
cat > /etc/systemd/system/voces-maya-asr.service <<'UNIT'
[Unit]
Description=Voces reconocimiento maya yucateco
After=network-online.target
Wants=network-online.target
[Service]
User=deploy
Group=www-data
WorkingDirectory=/var/www/vocesdemitierra/services/maya-asr
Environment=HF_HOME=/var/www/vocesdemitierra/services/maya-asr/cache
ExecStart=/var/www/vocesdemitierra/services/maya-asr/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8765 --workers 1
Restart=no
RestartSec=30
MemoryMax=6G
CPUQuota=150%
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/var/www/vocesdemitierra/services/maya-asr/cache
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now voces-maya-asr
echo "La primera carga descarga ~4 GB. Consulta: journalctl -u voces-maya-asr -f"
