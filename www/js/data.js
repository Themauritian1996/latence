'use strict';
/* =====================================================================
   Latence — données de référence
   Normes adultes : Preston & Shapiro, Electromyography and Neuromuscular
   Disorders (3e éd.) — valeurs usuelles, modifiables dans Réglages pour
   correspondre aux normes du laboratoire.
   amp : limite inférieure (moteur mV, sensitif/mixte µV)
   lat : limite supérieure (moteur = latence de début ; sensitif = pic)
   cv  : limite inférieure (m/s) ; f : latence F minimale, limite sup (ms)
   ===================================================================== */
const NORMS_VERSION = 3;
const NORMS_DEFAULT = [
  // ---------- Moteurs ----------
  {key:'median_m_apb',  grp:'Moteur', label:'Médian → APB (court abducteur du pouce)', type:'motor', amp:4.0, lat:4.4, cv:49, f:31, dist:'7 cm'},
  {key:'ulnar_m_adm',   grp:'Moteur', label:'Ulnaire (cubital) → ADM', type:'motor', amp:6.0, lat:3.3, cv:49, f:32, dist:'7 cm'},
  {key:'ulnar_m_fdi',   grp:'Moteur', label:'Ulnaire → FDI (1er interosseux dorsal)', type:'motor', amp:7.0, lat:4.5, cv:49, f:32, dist:''},
  {key:'radial_m_eip',  grp:'Moteur', label:'Radial → EIP (extenseur propre de l\'index)', type:'motor', amp:2.0, lat:2.9, cv:49, f:null, dist:''},
  {key:'peroneal_m_edb',grp:'Moteur', label:'Fibulaire (péronier) → EDB', type:'motor', amp:2.0, lat:6.5, cv:44, f:56, dist:'9 cm'},
  {key:'peroneal_m_ta', grp:'Moteur', label:'Fibulaire (péronier) → tibial antérieur', type:'motor', amp:3.0, lat:6.7, cv:44, f:null, dist:''},
  {key:'tibial_m_ahb',  grp:'Moteur', label:'Tibial → AHB (abducteur de l\'hallux)', type:'motor', amp:4.0, lat:5.8, cv:41, f:56, dist:'9 cm'},
  // ---------- Sensitifs (antidromiques, latence au pic) ----------
  {key:'median_s_d2',   grp:'Sensitif', label:'Médian → D2', type:'sensory', amp:20, lat:3.5, cv:50, dist:'13 cm'},
  {key:'ulnar_s_d5',    grp:'Sensitif', label:'Ulnaire → D5', type:'sensory', amp:17, lat:3.1, cv:50, dist:'11 cm'},
  {key:'radial_s',      grp:'Sensitif', label:'Radial superficiel → tabatière', type:'sensory', amp:15, lat:2.9, cv:50, dist:'10 cm'},
  {key:'dorsal_ulnar_cut', grp:'Sensitif', label:'Cutané dorsal ulnaire', type:'sensory', amp:8, lat:2.5, cv:50, dist:'8 cm'},
  {key:'lat_antebrachial', grp:'Sensitif', label:'Cutané antébrachial latéral', type:'sensory', amp:10, lat:3.0, cv:55, dist:'12 cm'},
  {key:'med_antebrachial', grp:'Sensitif', label:'Cutané antébrachial médial', type:'sensory', amp:5, lat:3.2, cv:50, dist:'12 cm'},
  {key:'sural',         grp:'Sensitif', label:'Sural', type:'sensory', amp:6, lat:4.4, cv:40, dist:'14 cm'},
  {key:'superficial_peroneal', grp:'Sensitif', label:'Fibulaire superficiel', type:'sensory', amp:6, lat:4.4, cv:40, dist:'14 cm'},
  {key:'saphenous',     grp:'Sensitif', label:'Saphène', type:'sensory', amp:4, lat:4.4, cv:40, dist:'14 cm'},
  // ---------- Mixtes palmaires (orthodromiques, 8 cm) ----------
  {key:'median_palm',   grp:'Mixte', label:'Médian palmaire mixte (8 cm)', type:'mixed', amp:50, lat:2.2, cv:50, dist:'8 cm'},
  {key:'ulnar_palm',    grp:'Mixte', label:'Ulnaire palmaire mixte (8 cm)', type:'mixed', amp:12, lat:2.2, cv:50, dist:'8 cm'},
  // ---------- Études comparatives (valeurs absolues non jugées ; seule la différence compte) ----------
  {key:'median_ring',   grp:'Comparatif', label:'Médian → D4 (14 cm)', type:'sensory', amp:null, lat:null, cv:null, dist:'14 cm'},
  {key:'ulnar_ring',    grp:'Comparatif', label:'Ulnaire → D4 (14 cm)', type:'sensory', amp:null, lat:null, cv:null, dist:'14 cm'},
  {key:'median_thumb',  grp:'Comparatif', label:'Médian → pouce (10 cm)', type:'sensory', amp:null, lat:null, cv:null, dist:'10 cm'},
  {key:'radial_thumb',  grp:'Comparatif', label:'Radial → pouce (10 cm)', type:'sensory', amp:null, lat:null, cv:null, dist:'10 cm'},
  {key:'median_lumbrical', grp:'Comparatif', label:'Médian → 2e lombrical (8 cm)', type:'motor', amp:null, lat:null, cv:null, dist:'8 cm'},
  {key:'ulnar_interosseous', grp:'Comparatif', label:'Ulnaire → interosseux (8 cm)', type:'motor', amp:null, lat:null, cv:null, dist:'8 cm'},
  // ---------- Réponses tardives / réflexes ----------
  {key:'h_soleus',      grp:'Réflexe', label:'Réflexe H (soléaire)', type:'H', amp:null, lat:34, cv:null, dist:''},
  {key:'blink_r1',      grp:'Réflexe', label:'Clignement R1', type:'blink', amp:null, lat:13, cv:null, dist:''},
  {key:'blink_r2i',     grp:'Réflexe', label:'Clignement R2 ipsilatéral', type:'blink', amp:null, lat:41, cv:null, dist:''},
  {key:'blink_r2c',     grp:'Réflexe', label:'Clignement R2 controlatéral', type:'blink', amp:null, lat:44, cv:null, dist:''}
];

/* Paires comparatives : anormal si différence (a − b) ≥ seuil (ms) */
const COMPARISONS_DEFAULT = [
  {id:'palm',  a:'median_palm',      b:'ulnar_palm',         thr:0.4, label:'Palmaire médian − ulnaire'},
  {id:'ring',  a:'median_ring',      b:'ulnar_ring',         thr:0.5, label:'Annulaire (D4) médian − ulnaire'},
  {id:'thumb', a:'median_thumb',     b:'radial_thumb',       thr:0.5, label:'Pouce médian − radial'},
  {id:'lumb',  a:'median_lumbrical', b:'ulnar_interosseous', thr:0.5, label:'Lombrical − interosseux'}
];
const CSI_THR = 1.0;          // Combined Sensory Index (Robinson) : anormal si ≥ 1,0 ms
const OTHER_RULES = {
  blockDrop: 50,              // % de chute d'amplitude prox./dist. = bloc de conduction probable
  blockPossible: 30,          // % : chute à interpréter (sauf tibial)
  elbowCv: 50,                // m/s : vitesse trans-coude ulnaire minimale
  focalDrop: 10,              // m/s : ralentissement focal vs segment de référence
  sideAmp: 50,                // % : asymétrie d'amplitude côté-à-côté significative
  demyLat: 130,               // % de la LSN : zone démyélinisante (latence distale / onde F)
  demyCv: 75,                 // % de la LIN : zone démyélinisante (vitesse)
  tempHand: 32,               // °C minimum main
  tempFoot: 30,               // °C minimum pied
  hSide: 1.5                  // ms : asymétrie réflexe H
};

/* =====================================================================
   Bibliothèque de muscles (innervation : nerf, racines, tronc/cordon)
   ===================================================================== */
const MUSCLES = [
  // Tête / cou / tronc
  {n:'Langue', en:'Tongue', nerf:'Hypoglosse (XII)', rac:'Bulbaire', reg:'Bulbaire'},
  {n:'Masséter', en:'Masseter', nerf:'Trijumeau (V3)', rac:'Bulbaire', reg:'Bulbaire'},
  {n:'Orbiculaire de l\'œil', en:'Orbicularis oculi', nerf:'Facial (VII)', rac:'Bulbaire', reg:'Bulbaire'},
  {n:'Frontal', en:'Frontalis', nerf:'Facial (VII)', rac:'Bulbaire', reg:'Bulbaire'},
  {n:'Sterno-cléido-mastoïdien', en:'SCM', nerf:'Accessoire (XI)', rac:'XI (C2–C3)', reg:'Cou'},
  {n:'Trapèze supérieur', en:'Upper trapezius', nerf:'Accessoire (XI)', rac:'XI (C3–C4)', reg:'Cou'},
  {n:'Paraspinaux cervicaux', en:'Cervical paraspinals', nerf:'Rameaux dorsaux', rac:'C5–C8 (selon niveau)', reg:'Paraspinaux'},
  {n:'Paraspinaux thoraciques', en:'Thoracic paraspinals', nerf:'Rameaux dorsaux', rac:'T6–T10 (selon niveau)', reg:'Paraspinaux'},
  {n:'Droit de l\'abdomen', en:'Rectus abdominis', nerf:'Intercostaux', rac:'T7–T12', reg:'Tronc'},
  {n:'Paraspinaux lombaires', en:'Lumbar paraspinals', nerf:'Rameaux dorsaux', rac:'L3–S1 (selon niveau)', reg:'Paraspinaux'},
  // Membre supérieur
  {n:'Rhomboïdes', en:'Rhomboids', nerf:'Dorsal de la scapula', rac:'C5', reg:'Épaule', plex:'Racine (pré-plexus)'},
  {n:'Dentelé antérieur', en:'Serratus anterior', nerf:'Thoracique long', rac:'C5–C7', reg:'Épaule', plex:'Racine (pré-plexus)'},
  {n:'Sus-épineux', en:'Supraspinatus', nerf:'Suprascapulaire', rac:'C5–C6', reg:'Épaule', plex:'Tronc supérieur'},
  {n:'Sous-épineux', en:'Infraspinatus', nerf:'Suprascapulaire', rac:'C5–C6', reg:'Épaule', plex:'Tronc supérieur'},
  {n:'Deltoïde', en:'Deltoid', nerf:'Axillaire', rac:'C5–C6', reg:'Épaule', plex:'Tronc sup. / cordon post.'},
  {n:'Grand dorsal', en:'Latissimus dorsi', nerf:'Thoracodorsal', rac:'C6–C8', reg:'Épaule', plex:'Cordon postérieur'},
  {n:'Grand pectoral', en:'Pectoralis major', nerf:'Pectoraux médial/latéral', rac:'C5–T1', reg:'Épaule', plex:'Cordons latéral/médial'},
  {n:'Biceps brachial', en:'Biceps', nerf:'Musculocutané', rac:'C5–C6', reg:'Bras', plex:'Tronc sup. / cordon lat.'},
  {n:'Brachial', en:'Brachialis', nerf:'Musculocutané', rac:'C5–C6', reg:'Bras', plex:'Tronc sup. / cordon lat.'},
  {n:'Triceps', en:'Triceps', nerf:'Radial', rac:'C6–C8 (C7)', reg:'Bras', plex:'Tronc moyen / cordon post.'},
  {n:'Anconé', en:'Anconeus', nerf:'Radial', rac:'C7–C8', reg:'Bras', plex:'Cordon postérieur'},
  {n:'Brachioradial', en:'Brachioradialis', nerf:'Radial', rac:'C5–C6', reg:'Avant-bras', plex:'Tronc sup. / cordon post.'},
  {n:'Long extenseur radial du carpe', en:'ECR longus', nerf:'Radial', rac:'C6–C7', reg:'Avant-bras', plex:'Cordon postérieur'},
  {n:'Supinateur', en:'Supinator', nerf:'Interosseux postérieur', rac:'C5–C6', reg:'Avant-bras', plex:'Cordon postérieur'},
  {n:'Extenseur commun des doigts', en:'EDC', nerf:'Interosseux postérieur', rac:'C7–C8', reg:'Avant-bras', plex:'Cordon postérieur'},
  {n:'Extenseur propre de l\'index', en:'EIP', nerf:'Interosseux postérieur', rac:'C7–C8', reg:'Avant-bras', plex:'Cordon postérieur'},
  {n:'Rond pronateur', en:'Pronator teres', nerf:'Médian', rac:'C6–C7', reg:'Avant-bras', plex:'Tronc sup./moy. / cordon lat.'},
  {n:'Fléchisseur radial du carpe', en:'FCR', nerf:'Médian', rac:'C6–C7', reg:'Avant-bras', plex:'Cordon latéral'},
  {n:'Long fléchisseur du pouce', en:'FPL', nerf:'Interosseux antérieur', rac:'C7–C8', reg:'Avant-bras', plex:'Cordon médial/lat.'},
  {n:'Carré pronateur', en:'Pronator quadratus', nerf:'Interosseux antérieur', rac:'C7–C8', reg:'Avant-bras', plex:'Cordon médial/lat.'},
  {n:'FDP II–III', en:'FDP 2-3', nerf:'Interosseux antérieur', rac:'C7–C8', reg:'Avant-bras', plex:'Cordon médial/lat.'},
  {n:'Fléchisseur ulnaire du carpe', en:'FCU', nerf:'Ulnaire', rac:'C8–T1 (C7)', reg:'Avant-bras', plex:'Tronc inf. / cordon méd.'},
  {n:'FDP IV–V', en:'FDP 4-5', nerf:'Ulnaire', rac:'C8–T1', reg:'Avant-bras', plex:'Tronc inf. / cordon méd.'},
  {n:'Court abducteur du pouce', en:'APB', nerf:'Médian', rac:'C8–T1', reg:'Main', plex:'Tronc inf. / cordon méd.'},
  {n:'Opposant du pouce', en:'Opponens pollicis', nerf:'Médian', rac:'C8–T1', reg:'Main', plex:'Tronc inf. / cordon méd.'},
  {n:'Premier interosseux dorsal', en:'FDI', nerf:'Ulnaire (branche profonde)', rac:'C8–T1', reg:'Main', plex:'Tronc inf. / cordon méd.'},
  {n:'Abducteur du 5e doigt', en:'ADM', nerf:'Ulnaire', rac:'C8–T1', reg:'Main', plex:'Tronc inf. / cordon méd.'},
  {n:'Adducteur du pouce', en:'Adductor pollicis', nerf:'Ulnaire (branche profonde)', rac:'C8–T1', reg:'Main', plex:'Tronc inf. / cordon méd.'},
  // Membre inférieur
  {n:'Iliopsoas', en:'Iliopsoas', nerf:'Fémoral / plexus lombaire', rac:'L2–L3', reg:'Hanche', plex:'Plexus lombaire'},
  {n:'Long adducteur', en:'Adductor longus', nerf:'Obturateur', rac:'L2–L4', reg:'Cuisse', plex:'Plexus lombaire'},
  {n:'Vaste médial', en:'Vastus medialis', nerf:'Fémoral', rac:'L2–L4', reg:'Cuisse', plex:'Plexus lombaire'},
  {n:'Vaste latéral', en:'Vastus lateralis', nerf:'Fémoral', rac:'L2–L4', reg:'Cuisse', plex:'Plexus lombaire'},
  {n:'Droit fémoral', en:'Rectus femoris', nerf:'Fémoral', rac:'L2–L4', reg:'Cuisse', plex:'Plexus lombaire'},
  {n:'Tenseur du fascia lata', en:'TFL', nerf:'Fessier supérieur', rac:'L4–S1', reg:'Hanche', plex:'Plexus lombosacré'},
  {n:'Moyen fessier', en:'Gluteus medius', nerf:'Fessier supérieur', rac:'L4–S1 (L5)', reg:'Hanche', plex:'Plexus lombosacré'},
  {n:'Grand fessier', en:'Gluteus maximus', nerf:'Fessier inférieur', rac:'L5–S2', reg:'Hanche', plex:'Plexus lombosacré'},
  {n:'Biceps fémoral (chef court)', en:'Short head biceps femoris', nerf:'Sciatique (division fibulaire)', rac:'L5–S1', reg:'Cuisse', plex:'Plexus lombosacré'},
  {n:'Biceps fémoral (chef long)', en:'Long head biceps femoris', nerf:'Sciatique (division tibiale)', rac:'L5–S2', reg:'Cuisse', plex:'Plexus lombosacré'},
  {n:'Semi-tendineux', en:'Semitendinosus', nerf:'Sciatique (division tibiale)', rac:'L5–S2', reg:'Cuisse', plex:'Plexus lombosacré'},
  {n:'Tibial antérieur', en:'Tibialis anterior', nerf:'Fibulaire profond', rac:'L4–L5', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Long extenseur de l\'hallux', en:'EHL', nerf:'Fibulaire profond', rac:'L5–S1', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Long fibulaire', en:'Peroneus longus', nerf:'Fibulaire superficiel', rac:'L5–S1', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Tibial postérieur', en:'Tibialis posterior', nerf:'Tibial', rac:'L4–L5', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Long fléchisseur des orteils', en:'FDL', nerf:'Tibial', rac:'L5–S1', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Gastrocnémien médial', en:'Medial gastrocnemius', nerf:'Tibial', rac:'S1–S2', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Gastrocnémien latéral', en:'Lateral gastrocnemius', nerf:'Tibial', rac:'S1–S2', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Soléaire', en:'Soleus', nerf:'Tibial', rac:'S1–S2', reg:'Jambe', plex:'Plexus lombosacré'},
  {n:'Court extenseur des orteils', en:'EDB', nerf:'Fibulaire profond', rac:'L5–S1', reg:'Pied', plex:'Plexus lombosacré'},
  {n:'Abducteur de l\'hallux', en:'Abductor hallucis', nerf:'Tibial (plantaire médial)', rac:'S1–S2', reg:'Pied', plex:'Plexus lombosacré'},
  {n:'Abducteur du 5e orteil', en:'ADQP', nerf:'Tibial (plantaire latéral)', rac:'S1–S2', reg:'Pied', plex:'Plexus lombosacré'}
];

/* Échelles de l'EMG à l'aiguille */
const EMG_FIELDS = [
  {k:'ins',  l:'Insertion',   opts:['N','↑','↓']},
  {k:'fib',  l:'Fibs',        opts:['0','1+','2+','3+','4+']},
  {k:'psw',  l:'PSW',         opts:['0','1+','2+','3+','4+']},
  {k:'fasc', l:'Fasc.',       opts:['0','+']},
  {k:'amp',  l:'Amp. PUM',    opts:['N','↑','↓']},
  {k:'dur',  l:'Durée',       opts:['N','↑','↓']},
  {k:'poly', l:'Polyph.',     opts:['N','↑']},
  {k:'rec',  l:'Recrutement', opts:['N','↓','↓↓','↓↓↓','Précoce']},
  {k:'act',  l:'Activation',  opts:['N','↓']}
];
const EMG_OTHER = ['Myotonie','Décharges complexes répétitives','Myokymie','Neuromyotonie','Crampes'];

/* =====================================================================
   Schémas de réponse (JSON) pour Gemini
   ===================================================================== */
const N = t => ({type:t, nullable:true});
const SCHEMA_EXTRACT = {
  type:'object',
  properties:{
    temperature_main: N('number'),
    temperature_pied: N('number'),
    lisibilite: {type:'string', description:'bonne | partielle | mauvaise'},
    rows:{type:'array', items:{type:'object', properties:{
      type:{type:'string', enum:['motor','sensory','mixed','F','H','blink','other']},
      nerf:{type:'string'},
      cote:{type:'string', enum:['G','D','?']},
      stimulation:{type:'string'},
      enregistrement:{type:'string'},
      segment:{type:'string', enum:['distal','avant-bras','trans-coude','bras','aisselle','erb','jambe','trans-tete-fibulaire','creux-poplite','autre']},
      latence: N('number'),
      latence_pic: N('number'),
      amplitude: N('number'),
      duree: N('number'),
      distance: N('number'),
      vitesse: N('number'),
      f_lat: N('number'),
      absent:{type:'boolean'},
      normKey:{type:'string'},
      remarque:{type:'string'}
    }, required:['type','nerf','cote','normKey','absent']}},
    autres:{type:'string', description:'Autres informations lisibles (RNS, notes du technicien) sans identifiant patient'}
  },
  required:['rows']
};

const SCHEMA_ANALYSIS = {
  type:'object',
  properties:{
    synthese:{type:'string'},
    constats:{type:'array', items:{type:'object', properties:{
      texte:{type:'string'}, niveau:{type:'string', enum:['anormal','limite','normal','technique']}
    }, required:['texte','niveau']}},
    pattern:{type:'string', description:'ex. mononeuropathie focale démyélinisante, polyneuropathie axonale sensitivomotrice, normal…'},
    conclusion_preliminaire:{type:'string'},
    severite:{type:'string'},
    localisation:{type:'string'},
    diagnostics_differentiels:{type:'array', items:{type:'string'}},
    correlation_clinique:{type:'string'},
    ncs_supplementaires:{type:'array', items:{type:'object', properties:{
      etude:{type:'string'}, raison:{type:'string'}
    }, required:['etude','raison']}},
    emg_plan:{type:'array', items:{type:'object', properties:{
      muscle:{type:'string'}, cote:{type:'string', enum:['G','D','Bilat']},
      raison:{type:'string'}, priorite:{type:'string', enum:['essentiel','recommandé','optionnel']}
    }, required:['muscle','cote','raison','priorite']}},
    strategie_emg:{type:'string'},
    alertes:{type:'array', items:{type:'string'}}
  },
  required:['synthese','constats','conclusion_preliminaire','emg_plan']
};

const SCHEMA_EMG_EXTRACT = {
  type:'object',
  properties:{ muscles:{type:'array', items:{type:'object', properties:{
    muscle:{type:'string'}, cote:{type:'string', enum:['G','D','?']},
    ins:{type:'string'}, fib:{type:'string'}, psw:{type:'string'}, fasc:{type:'string'},
    amp:{type:'string'}, dur:{type:'string'}, poly:{type:'string'}, rec:{type:'string'}, act:{type:'string'},
    autre:{type:'string'}
  }, required:['muscle','cote']}}},
  required:['muscles']
};

const SCHEMA_REPORT = {
  type:'object',
  properties:{
    renseignements:{type:'string'},
    technique:{type:'string'},
    ncs_resume:{type:'string'},
    emg_resume:{type:'string'},
    interpretation:{type:'string'},
    conclusion:{type:'string'},
    recommandations:{type:'string'}
  },
  required:['renseignements','technique','ncs_resume','interpretation','conclusion']
};

/* =====================================================================
   Consignes à Gemini
   ===================================================================== */
const KNOWLEDGE = `
Repères d'électrodiagnostic (adulte) à appliquer :
- Axonal : ↓ amplitude PAMC (CMAP) et/ou PANS (SNAP) avec latences/vitesses normales ou légèrement anormales (vitesse rarement < 75 % LIN). Démyélinisant : latence distale > 130 % LSN, vitesse < 75 % LIN, onde F > 130 % LSN, bloc de conduction (chute d'amplitude prox./dist. > 50 % sans dispersion > 30 %), dispersion temporelle. Une vitesse lente avec une amplitude très basse peut refléter une perte des fibres rapides plutôt qu'une démyélinisation.
- Lésion pré- vs post-ganglionnaire : PANS préservés dans le territoire déficitaire = radiculopathie (pré-ganglionnaire) ; PANS diminués = plexus ou nerf périphérique.
- Syndrome du canal carpien (SCC, carpal tunnel syndrome) : gradation de sévérité — léger = anomalie sensitive seule (latence/études comparatives) ; modéré = atteinte sensitive + latence motrice distale allongée ; sévère = PANS absent ou PAMC diminué / signes de perte axonale à l'EMG (APB). Études comparatives : palmaire ≥ 0,4 ms, D4 ≥ 0,5 ms, pouce ≥ 0,5 ms, lombrical-interosseux ≥ 0,5 ms, CSI ≥ 1,0 ms.
- Neuropathie ulnaire au coude (critères AANEM) : vitesse trans-coude < 50 m/s, ralentissement > 10 m/s vs avant-bras, chute d'amplitude > 20–30 % trans-coude, changement de morphologie ; EMG FDI, ADM, FDP IV-V, FCU (FCU souvent épargné). PANS cutané dorsal ulnaire anormal = lésion proximale au poignet.
- Neuropathie fibulaire à la tête du péroné : bloc/ralentissement trans-tête fibulaire ; EMG tibial antérieur, EHL, long fibulaire, et indispensable : chef court du biceps fémoral (sciatique) et tibial postérieur / moyen fessier / paraspinaux (L5) pour exclure sciatique et radiculopathie L5.
- Radiculopathie : NCS souvent normales (PANS préservés) ; EMG = diagnostic. Dépistage AANEM : ≈ 6 muscles couvrant tous les myotomes du membre + paraspinaux identifie la grande majorité des radiculopathies ; confirmer avec ≥ 2 muscles du même myotome innervés par des nerfs différents, territoire anormal respectant le myotome et non un nerf périphérique.
- Polyneuropathie : atteinte longueur-dépendante, symétrique ; sural/fibulaire superficiel touchés en premier ; comparer côté à côté. Chez > 60–70 ans, un sural absent bilatéralement peut être non spécifique — à pondérer.
- PIDC (CIDP) : critères EAN/PNS 2021. Guillain-Barré : précoce = ondes F absentes/prolongées, « sural sparing ».
- SLA (ALS) : critères de Gold Coast / Awaji — dénervation active + chronique dans ≥ 2 régions (bulbaire, cervicale, thoracique, lombosacrée) avec PANS normaux ; paraspinaux thoraciques et langue utiles.
- Myopathie : PUM petits, brefs, polyphasiques, recrutement précoce ; PAMC généralement normaux. Jonction neuromusculaire : stimulation répétitive (décrément > 10 % à 3 Hz), incrément > 100 % post-effort (LEMS).
- Température : main < 32 °C ou pied < 30 °C → latences allongées et vitesses ralenties, amplitudes possiblement augmentées ; réchauffer ou interpréter avec prudence.
- Normes adultes ; enfants (myélinisation complète vers 3–5 ans) et sujets âgés : interpréter avec normes ajustées à l'âge. La taille influence les ondes F et le réflexe H.`;

const SYS_BASE = `Tu es un physiatre électromyographiste expert (électrodiagnostic, EMG/NCS) qui assiste un médecin au Québec. Tu écris en français médical québécois, précis et concis ; lorsqu'un terme est plus usuel en anglais, mets les deux (ex. PAMC (CMAP), PANS (SNAP), fibrillations (fibs), ondes positives (PSW)). Tu ne fabriques jamais de valeurs : tu t'appuies uniquement sur les données fournies. Les anomalies calculées par l'application à partir des normes du laboratoire sont fiables et prioritaires ; tu peux les nuancer (température, âge, artéfact technique) mais pas les ignorer. Le médecin reste responsable de l'interprétation finale.`;

const PROMPT_EXTRACT = (keys) => `Tâche : lire les photos de tableaux d'électroneurographie (conductions nerveuses, NCS) et transcrire chaque ligne de mesure en JSON.

Règles :
- Transcris fidèlement chaque nerf / site de stimulation présent. Une ligne par site de stimulation (ex. médian moteur : poignet, coude = 2 lignes). Les ondes F (latence minimale) vont dans f_lat de la ligne distale du nerf moteur correspondant, OU dans une ligne type "F" si présentées séparément.
- Unités : latences en ms, amplitudes motrices en mV, sensitives/mixtes en µV (convertir mV→µV si nécessaire pour les sensitifs), vitesses en m/s, distances en cm (convertir mm→cm).
- "latence" = latence de début (onset) ; "latence_pic" = latence au pic. Pour un sensitif, si une seule latence est fournie et qu'il s'agit du pic, mets-la dans latence_pic.
- Si la réponse est absente (NR, « no response », 0, —), absent = true et valeurs = null.
- Valeur illisible = null + précise-le dans remarque. Ne devine jamais un chiffre.
- cote : G (gauche) ou D (droit), ? si inconnu. Left/L = G ; Right/R = D.
- segment : site de stimulation de la ligne — "distal" pour la stimulation la plus distale (poignet/cheville), "avant-bras", "trans-coude" (au-dessus du coude, la vitesse de cette ligne étant le segment trans-coude), "bras", "aisselle", "erb", "jambe", "creux-poplite", "trans-tete-fibulaire" ; sinon "autre".
- normKey : choisis la clé correspondante dans cette liste, sinon "autre" :
${keys}
- Pour les études comparatives (D4 médian/ulnaire, pouce médian/radial, palmaire, lombrical/interosseux), crée une ligne par nerf avec la clé appropriée.
- N'écris AUCUN identifiant du patient (nom, numéro de dossier, date de naissance) même s'il est visible.
- Température(s) affichée(s) : temperature_main / temperature_pied si présentes.`;

const PROMPT_ANALYSIS = `Tâche : interpréter cette électroneurographie à la lumière du contexte clinique, puis proposer le plan d'EMG à l'aiguille.

Exigences :
1. synthese : 2–4 phrases.
2. constats : chaque anomalie (et les normalités pertinentes) avec niveau. Utilise les drapeaux calculés.
3. pattern + conclusion_preliminaire : formulation de type rapport (« Étude compatible avec… »), précise que la conclusion est provisoire avant l'EMG si l'EMG est pertinent.
4. severite (ex. SCC léger/modéré/sévère) et localisation la plus probable.
5. diagnostics_differentiels : 2–5 éléments.
6. correlation_clinique : cohérence ou discordance avec la clinique.
7. ncs_supplementaires : études de conduction manquantes qui changeraient l'interprétation (ex. sural controlatéral, études comparatives médian si NCS de routine normales mais clinique de SCC, cutané dorsal ulnaire, cutané antébrachial médial pour plexus inférieur, stimulation répétitive…).
8. emg_plan : muscles à tester, du plus au moins utile, avec côté et raison claire (ce que chaque muscle permet de distinguer : racine vs plexus vs nerf, site de compression, chronicité). Utilise prioritairement les noms exacts de la bibliothèque fournie. Inclus les paraspinaux quand une radiculopathie est dans le différentiel. Généralement 5–10 muscles ; plus si suspicion de maladie diffuse (ex. SLA : ≥ 3 régions).
9. strategie_emg : 1–3 phrases sur la logique de l'examen (et ce qui ferait élargir l'étude).
10. alertes : problèmes techniques (température, valeurs incohérentes, distances non standards, possible anastomose de Martin-Gruber si chute d'amplitude médian au coude avec ulnaire normal, etc.).`;

const PROMPT_EMG_EXTRACT = `Tâche : lire la/les photo(s) du tableau d'EMG à l'aiguille et transcrire chaque muscle. Utilise les codes : ins (N, ↑, ↓), fib et psw (0, 1+, 2+, 3+, 4+), fasc (0, +), amp/dur (N, ↑, ↓), poly (N, ↑), rec (N, ↓, ↓↓, ↓↓↓, Précoce), act (N, ↓). « Inc/Increased » = ↑, « Dec/Reduced » = ↓, « Early » = Précoce, « None » = 0. Ne transcris aucun identifiant du patient. Valeur illisible = chaîne vide.`;

const PROMPT_REPORT = `Tâche : rédiger le rapport final d'électrodiagnostic (EMG/NCS) à partir des données fournies (le tableau des conductions et le tableau EMG seront insérés automatiquement par l'application : n'en recopie pas toutes les valeurs, résume-les).

Style : rapport de physiatre québécois, concis, professionnel, phrases complètes. Sections :
- renseignements : motif de référence et éléments cliniques pertinents (sans identifiant).
- technique : examen réalisé, membres étudiés, température si connue, limitations.
- ncs_resume : résumé des conductions (anomalies d'abord, puis normalités pertinentes).
- emg_resume : résumé de l'EMG à l'aiguille (dénervation active, changements neurogènes chroniques, myopathiques, recrutement) ; vide si aucun EMG.
- interpretation : raisonnement électrodiagnostique (localisation, physiopathologie axonale vs démyélinisante, chronicité, sévérité), en tenant compte de la clinique.
- conclusion : formulation finale numérotée si plusieurs éléments (ex. « 1. Étude anormale. Les résultats sont compatibles avec… »). Si l'étude est normale, le dire et préciser ce qui n'est pas exclu.
- recommandations : suivi suggéré (corrélation clinique, imagerie, répétition de l'étude dans X semaines si lésion récente < 3 semaines, etc.).
Si l'EMG a été fait moins de 3 semaines après le début des symptômes, mentionner que la dénervation active peut ne pas encore être visible.`;
