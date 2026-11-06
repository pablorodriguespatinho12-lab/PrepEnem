#!/bin/bash
# Aviso no canto da tela do Windows quando o Claude precisa do Pablo
# (pedido de permissão, pergunta ou tarefa parada esperando).
# Gancho: Notification. Roda em segundo plano para não travar o Claude.

INPUT=$(cat)
TIPO=$(printf '%s' "$INPUT" | jq -r '.notification_type // empty' 2>/dev/null)
PASTA=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null | xargs -r basename)

case "$TIPO" in
  permission_prompt) MSG="Preciso da sua permissão" ;;
  idle_prompt)       MSG="Terminei. Sua vez" ;;
  elicitation_dialog|agent_needs_input) MSG="Tenho uma pergunta" ;;
  *) exit 0 ;;
esac

PS=/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe
[[ -x "$PS" ]] || exit 0

TITULO="Claude ${PASTA:+($PASTA)}"
( timeout 20 "$PS" -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; \$n=New-Object System.Windows.Forms.NotifyIcon; \$n.Icon=[System.Drawing.SystemIcons]::Information; \$n.Visible=\$true; \$n.ShowBalloonTip(6000,'$TITULO','$MSG',[System.Windows.Forms.ToolTipIcon]::Info); Start-Sleep 7; \$n.Dispose()" >/dev/null 2>&1 & )
exit 0
