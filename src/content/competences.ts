import type { CategorieCompetences, SectionMeta } from './types'

export const competencesSection: SectionMeta = {
  id: 'competences',
  nav: 'Compétences',
  titre: 'Compétences',
  picto: 'competences',
  sousTitre:
    'Un ensemble de compétences techniques acquises en formation, en projets personnels et en entreprise.',
}

/**
 * Des groupes par catégorie, par ordre de pertinence pour le SISR.
 * Ni pourcentage, ni contexte par outil (choix de Wladimir, `CONTENU-VALIDE.md` section 7).
 */
export const competences: CategorieCompetences[] = [
  {
    titre: 'Systèmes',
    picto: 'systemes',
    competences: ['Linux (Debian, Ubuntu Server)', 'Windows Server', 'Active Directory', 'Samba AD', 'Exchange'],
  },
  {
    titre: 'Réseau et sécurité périmétrique',
    picto: 'reseau',
    competences: [
      'VLAN',
      'MikroTik RouterOS',
      'pfSense (CARP)',
      'HAProxy et terminaison TLS',
      'Cisco Packet Tracer',
      'Draw.io',
    ],
  },
  {
    titre: 'Administration et scripts',
    picto: 'scripts',
    competences: ['SSH par clé', 'Bash', 'PowerShell'],
  },
  {
    titre: 'Virtualisation et conteneurs',
    picto: 'virtualisation',
    competences: ['Hyper-V', 'VMware', 'Docker'],
  },
  {
    titre: 'Services et automatisation',
    picto: 'automatisation',
    competences: [
      'n8n',
      'Dolibarr',
      'Jitsi Meet',
      'Nginx',
      'PHP-FPM',
      'MariaDB (réplication)',
      'PostgreSQL / PostGIS',
      'Git et GitHub',
    ],
  },
  {
    titre: 'Sécurité offensive (CTF)',
    picto: 'ctf',
    competences: ['Kali Linux', 'Nmap', 'Burp Suite', 'OSINT', 'Stéganographie', 'Cryptographie'],
  },
  {
    titre: 'Web',
    picto: 'web',
    competences: ['HTML', 'CSS', 'JavaScript', 'PHP', 'SQL', 'Bootstrap', 'Optimisation web et SEO'],
  },
]

/** Groupe à côté duquel se place le bloc de code HAProxy (voir `code.ts`). */
export const groupeDuCode = 'Réseau et sécurité périmétrique'
