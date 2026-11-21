/**
 * Bloc de code dessiné en particules (`CodeParticules`), dans la section Compétences, près du groupe
 * « Réseau et sécurité périmétrique » : la configuration HAProxy de NeoRetail, d’après la fiche E6
 * (réalisation 3). Le code est recopié tel quel : ne pas le reformater.
 */
export const codeHaproxy = {
  /** Libellé demandé par Wladimir, mot pour mot. */
  titre: 'Extrait de configuration HAProxy — projet NeoRetail',
  /** Réalisation du tableau de synthèse à laquelle le code se rapporte. */
  realisation: 3,
  lien: 'Ouvrir la fiche de la réalisation 3',
  lignes: [
    'backend retailsuite',
    '    balance roundrobin',
    '    cookie SRVID insert indirect nocache httponly secure',
    '    option httpchk GET /health',
    '    default-server inter 2s fall 3',
    '    server web-01 192.168.30.11:80 check cookie w1',
    '    server web-02 192.168.30.12:80 check cookie w2',
  ],
}
