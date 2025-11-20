#!/bin/bash

echo "🚀 QuantPayChain v2.0 - Push to GitHub"
echo ""

# Configurar Git
git config user.email "tu-email@example.com"
git config user.name "Franco Mengarelli"

# Agregar remote
git remote add origin https://github.com/francoMengarelli/quantpaychain-mvprov2.git

# Add, commit, push
git add .
git commit -m "feat: QuantPayChain v2.0 - Complete Platform"
git branch -M main
git push -u origin main

echo ""
echo "✅ ¡Proyecto subido exitosamente!"
echo "🌐 Ver en: https://github.com/francoMengarelli/quantpaychain-mvprov2"
