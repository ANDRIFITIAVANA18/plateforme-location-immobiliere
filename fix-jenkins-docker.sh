#!/bin/bash
echo "🔧 CORRECTION DES PERMISSIONS JENKINS/DOCKER"

# Vérifier les permissions actuelles
echo "📋 État actuel:"
groups jenkins
ls -la /var/run/docker.sock

# Corriger les permissions
echo "🔧 Correction en cours..."
sudo usermod -a -G docker jenkins
sudo chmod 666 /var/run/docker.sock

# Redémarrer Jenkins
echo "🔄 Redémarrage de Jenkins..."
sudo systemctl restart jenkins

echo "✅ Correction terminée"
echo "📋 Nouvel état:"
groups jenkins