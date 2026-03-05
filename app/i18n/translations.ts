export type Locale = 'en' | 'fi' | 'ar';

export interface Translations {
  nav: {
    vision: string;
    ventures: string;
    heritage: string;
    philanthropy: string;
    contact: string;
  };
  hero: {
    tagline: string;
    established: string;
    scroll: string;
  };
  vision: {
    label: string;
    headline: string;
    accentWord: string;
    body1: string;
    body2: string;
  };
  marquee1: string;
  marquee2: string;
  pillars: {
    label: string;
    title: string;
    titleAccent: string;
    items: {
      number: string;
      title: string;
      subtitle: string;
      body: string;
      stat: string;
      statLabel: string;
    }[];
  };
  heritage: {
    label: string;
    motto: string;
    mottoTranslation: string;
    values: {
      latin: string;
      english: string;
      icon: string;
      text: string;
    }[];
  };
  philanthropy: {
    label: string;
    title: string;
    titleAccent: string;
    intro: string;
    dogTitle: string;
    dogBody: string;
    dogStat: string;
    dogStatLabel: string;
    quote: string;
  };
  contact: {
    label: string;
    title: string;
    titleAccent: string;
    body: string;
  };
  footer: {
    copyright: string;
  };
  langSwitch: {
    en: string;
    fi: string;
    ar: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      vision: 'Vision',
      ventures: 'Ventures',
      heritage: 'Heritage',
      philanthropy: 'Foundation',
      contact: 'Contact',
    },
    hero: {
      tagline: 'Strategic Ventures · Nordic Heritage · Global Ambition',
      established: 'Est. Finland — Netherlands',
      scroll: 'Scroll',
    },
    vision: {
      label: 'Our Philosophy',
      headline: 'Building legacies that transcend generations',
      accentWord: 'transcend',
      body1:
        'Rink Group operates at the intersection of Nordic innovation and time-tested principles. We don\'t chase trends — we build structures that compound value across decades, jurisdictions, and generations. With a deep sense of autonomous systems and systems thinking, we architect solutions that are self-sustaining and adaptive.',
      body2:
        'From the ancient taiga forests of Finland to the trading floors of Amsterdam, our portfolio reflects a singular conviction: that the greatest returns flow from patience, integrity, and the courage to think in centuries. We implement, not theorize.',
    },
    marquee1: 'LUMEN FELICIS',
    marquee2: 'TECHNOLOGY · NATURE · MARITIME · CONSULTING · PHILANTHROPY',
    pillars: {
      label: 'Portfolio',
      title: 'Our',
      titleAccent: 'Ventures',
      items: [
        {
          number: 'I',
          title: 'Technology',
          subtitle: 'AetherLink B.V.',
          body: 'AI consulting and intelligent automation. We architect the systems that transform enterprises into adaptive, self-optimizing organisms. From agent ecosystems to strategic digital transformation — with a deep understanding of autonomous systems and systems thinking.',
          stat: 'EUR 225/hr',
          statLabel: 'consulting rate',
        },
        {
          number: 'II',
          title: 'Nature',
          subtitle: 'TaigaSchool',
          body: 'Regenerative eco-hospitality in the Kuusamo wilderness. Boutique cabins, Northern Lights experiences, and deep forest immersion. Where ancient taiga meets contemporary sanctuary.',
          stat: '180 ha',
          statLabel: 'pristine forest',
        },
        {
          number: 'III',
          title: 'Maritime',
          subtitle: 'Van Diemen AOS',
          body: 'Advanced ship recycling and maritime decommissioning. Pioneering sustainable end-of-life solutions for the global fleet with Primal AOS methodology. Responsible demolition that turns maritime heritage into recoverable value.',
          stat: '€50K',
          statLabel: 'first contract',
        },
        {
          number: 'IV',
          title: 'Consulting',
          subtitle: 'WorldLine · Senior AI',
          body: 'Senior AI consulting for WorldLine, one of Europe\'s leading payment technology companies. Systems architecture, autonomous agent design, and enterprise-grade AI implementation at the highest level.',
          stat: '2026',
          statLabel: 'active engagement',
        },
        {
          number: 'V',
          title: 'Platform',
          subtitle: 'Solvari Design',
          body: 'Design system architecture and AI integration for the largest home improvement platform in the Benelux. Apple-inspired design language, agent-ready infrastructure.',
          stat: '2026',
          statLabel: 'design system',
        },
      ],
    },
    heritage: {
      label: 'Our Heritage',
      motto: '\u201CLumen Felicis\u201D',
      mottoTranslation: 'The Light of Fortune',
      values: [
        { latin: 'Prudentia', english: 'Prudence', icon: '◈', text: 'We measure twice and act with conviction. Strategic patience is our competitive advantage.' },
        { latin: 'Integritas', english: 'Integrity', icon: '◇', text: 'Our word is our bond. In every jurisdiction, every partnership, every handshake.' },
        { latin: 'Fortitudo', english: 'Fortitude', icon: '△', text: 'We build for decades, not quarters. True wealth compounds through resilience.' },
        { latin: 'Humanitas', english: 'Humanity', icon: '○', text: 'Technology serves people. Nature nurtures people. Every living being deserves dignity.' },
      ],
    },
    philanthropy: {
      label: 'Foundation',
      title: 'The Lives That',
      titleAccent: 'Matter Most',
      intro: 'Beyond business, Rink Group holds a foundational commitment to the welfare of those who cannot speak for themselves. Our philanthropic mission is deeply personal and non-negotiable.',
      dogTitle: 'Canine Welfare Initiative',
      dogBody: 'The life, wellness, and dignity of dogs is one of our core foundational goals. We believe that a civilization is measured by how it treats its most loyal companions. From rescue operations to sanctuary funding, from veterinary access programs to advocacy — we invest in a world where every dog knows safety, warmth, and love.',
      dogStat: '∞',
      dogStatLabel: 'unconditional',
      quote: '"The greatness of a nation can be judged by the way its animals are treated." — Mahatma Gandhi',
    },
    contact: {
      label: 'Connect',
      title: 'Begin the',
      titleAccent: 'conversation',
      body: 'For partnership inquiries, investment opportunities, or strategic collaboration.',
    },
    footer: {
      copyright: 'Rink Group OY',
    },
    langSwitch: {
      en: 'EN',
      fi: 'FI',
      ar: 'عربي',
    },
  },

  fi: {
    nav: {
      vision: 'Visio',
      ventures: 'Yritykset',
      heritage: 'Perintö',
      philanthropy: 'Säätiö',
      contact: 'Yhteystiedot',
    },
    hero: {
      tagline: 'Strategiset sijoitukset · Pohjoismainen perintö · Globaali kunnianhimo',
      established: 'Per. Suomi — Alankomaat',
      scroll: 'Vieritä',
    },
    vision: {
      label: 'Filosofiamme',
      headline: 'Rakennamme perintöä joka ylittää sukupolvet',
      accentWord: 'ylittää',
      body1:
        'Rink Group toimii pohjoismaisen innovaation ja aika-testattujen periaatteiden risteyksessä. Emme jahtaa trendejä — rakennamme rakenteita, jotka kerryttävät arvoa vuosikymmenten, lainkäyttöalueiden ja sukupolvien yli. Syvällinen ymmärrys autonomisista järjestelmistä ja systeemiajattelusta ohjaa arkkitehtuuriamme.',
      body2:
        'Suomen ikuisista taigametsistä Amsterdamin kauppakeskuksiin, portfoliomme heijastaa yhtä vakaumusta: suurimmat tuotot syntyvät kärsivällisyydestä, rehellisyydestä ja rohkeudesta ajatella vuosisatojen mittakaavassa.',
    },
    marquee1: 'LUMEN FELICIS',
    marquee2: 'TEKNOLOGIA · LUONTO · MERENKULKU · KONSULTOINTI · HYVÄNTEKEVÄISYYS',
    pillars: {
      label: 'Portfolio',
      title: 'Meidän',
      titleAccent: 'Yritykset',
      items: [
        {
          number: 'I',
          title: 'Teknologia',
          subtitle: 'AetherLink B.V.',
          body: 'Tekoälykonsultointi ja älykäs automaatio. Arkkitehtuurimme muuttaa yritykset mukautuviksi, itseään optimoiviksi organismeiksi. Agenttiekosysteemeistä strategiseen digitaaliseen transformaatioon — syvä ymmärrys autonomisista järjestelmistä ja systeemiajattelusta.',
          stat: '225 €/t',
          statLabel: 'konsultointihinta',
        },
        {
          number: 'II',
          title: 'Luonto',
          subtitle: 'TaigaSchool',
          body: 'Regeneratiivista eko-vieraanvaraisuutta Kuusamon erämaassa. Boutique-mökit, revontuli-elämykset ja syvä metsäkokemus. Missä ikuinen taiga kohtaa nykyaikaisen turvapaikan.',
          stat: '180 ha',
          statLabel: 'koskematonta metsää',
        },
        {
          number: 'III',
          title: 'Merenkulku',
          subtitle: 'Van Diemen AOS',
          body: 'Edistyksellistä laivojen kierrätystä ja merenkulun käytöstäpoistoa. Edelläkävijä kestävissä elinkaaren loppuratkaisuissa maailmanlaajuiselle laivastolle Primal AOS -menetelmällä. Vastuullista purkua, joka muuttaa merenkulkuperinnön palautettavaksi arvoksi.',
          stat: '50 000 €',
          statLabel: 'ensimmäinen sopimus',
        },
        {
          number: 'IV',
          title: 'Konsultointi',
          subtitle: 'WorldLine · Senior AI',
          body: 'Senior-tason tekoälykonsultointi WorldLinelle, yhdelle Euroopan johtavista maksujärjestelmäyrityksistä. Järjestelmäarkkitehtuuri, autonominen agenttisuunnittelu ja yritystason tekoälyn implementointi korkeimmalla tasolla.',
          stat: '2026',
          statLabel: 'aktiivinen toimeksianto',
        },
        {
          number: 'V',
          title: 'Alusta',
          subtitle: 'Solvari Design',
          body: 'Suunnittelujärjestelmäarkkitehtuuri ja tekoälyintegraatio Benelux-maiden suurimmalle kodin kunnostusalustalle. Apple-inspiroitu suunnittelukieli, agenttikelpoinen infrastruktuuri.',
          stat: '2026',
          statLabel: 'suunnittelujärjestelmä',
        },
      ],
    },
    heritage: {
      label: 'Perintömme',
      motto: '\u201CLumen Felicis\u201D',
      mottoTranslation: 'Onnen Valo',
      values: [
        { latin: 'Prudentia', english: 'Harkinta', icon: '◈', text: 'Mittaamme kahdesti ja toimimme vakaumuksella. Strateginen kärsivällisyys on kilpailuetumme.' },
        { latin: 'Integritas', english: 'Rehellisyys', icon: '◇', text: 'Sanamme on sitoumuksemme. Jokaisessa lainkäyttöalueessa, kumppanuudessa ja kädenpuristuksessa.' },
        { latin: 'Fortitudo', english: 'Lujuus', icon: '△', text: 'Rakennamme vuosikymmeniksi, emme neljännesvuosiksi. Todellinen varallisuus kertyy kestävyyden kautta.' },
        { latin: 'Humanitas', english: 'Ihmisyys', icon: '○', text: 'Teknologia palvelee ihmisiä. Luonto hoivaa ihmisiä. Jokainen elävä olento ansaitsee arvokkuuden.' },
      ],
    },
    philanthropy: {
      label: 'Säätiö',
      title: 'Elämät Jotka',
      titleAccent: 'Merkitsevät Eniten',
      intro: 'Liiketoiminnan ulkopuolella Rink Groupilla on perustavanlaatuinen sitoumus niiden hyvinvointiin, jotka eivät voi puhua puolestaan. Hyväntekeväisyystehtävämme on syvästi henkilökohtainen ja ehdoton.',
      dogTitle: 'Koirien hyvinvointialoite',
      dogBody: 'Koirien elämä, hyvinvointi ja arvokkuus on yksi ydinperustavoitteistamme. Uskomme, että sivilisaatiota mitataan sillä, miten se kohtelee uskollisimpia kumppaneitaan. Pelastusoperaatioista turvakotirahoitukseen, eläinlääkäripalveluohjelmista edunvalvontaan — investoimme maailmaan, jossa jokainen koira tuntee turvan, lämmön ja rakkauden.',
      dogStat: '∞',
      dogStatLabel: 'ehdoton',
      quote: '"Kansakunnan suuruus voidaan arvioida siitä, miten sen eläimiä kohdellaan." — Mahatma Gandhi',
    },
    contact: {
      label: 'Yhteystiedot',
      title: 'Aloita',
      titleAccent: 'keskustelu',
      body: 'Kumppanuustiedusteluihin, sijoitusmahdollisuuksiin tai strategiseen yhteistyöhön.',
    },
    footer: {
      copyright: 'Rink Group OY',
    },
    langSwitch: {
      en: 'EN',
      fi: 'FI',
      ar: 'عربي',
    },
  },

  ar: {
    nav: {
      vision: 'الرؤية',
      ventures: 'المشاريع',
      heritage: 'التراث',
      philanthropy: 'المؤسسة',
      contact: 'تواصل',
    },
    hero: {
      tagline: 'مشاريع استراتيجية · تراث شمالي · طموح عالمي',
      established: 'تأسست في فنلندا — هولندا',
      scroll: 'مرّر',
    },
    vision: {
      label: 'فلسفتنا',
      headline: 'نبني إرثاً يتجاوز الأجيال',
      accentWord: 'يتجاوز',
      body1:
        'تعمل مجموعة رينك عند تقاطع الابتكار الشمالي والمبادئ المجرّبة عبر الزمن. لا نلاحق الاتجاهات — بل نبني هياكل تضاعف القيمة عبر العقود والأجيال. مع إحساس عميق بالأنظمة المستقلة والتفكير المنظومي، نصمم حلولاً ذاتية الاستدامة والتكيف.',
      body2:
        'من غابات التايغا القديمة في فنلندا إلى قاعات التداول في أمستردام، تعكس محفظتنا قناعة واحدة: أن أعظم العوائد تنبع من الصبر والنزاهة والشجاعة للتفكير بقرون.',
    },
    marquee1: 'لومين فيليسيس',
    marquee2: 'التكنولوجيا · الطبيعة · البحرية · الاستشارات · العمل الخيري',
    pillars: {
      label: 'المحفظة',
      title: '',
      titleAccent: 'مشاريعنا',
      items: [
        {
          number: 'I',
          title: 'التكنولوجيا',
          subtitle: 'AetherLink B.V.',
          body: 'استشارات الذكاء الاصطناعي والأتمتة الذكية. نصمم الأنظمة التي تحوّل المؤسسات إلى كائنات متكيفة ذاتية التحسين. من منظومات الوكلاء إلى التحول الرقمي الاستراتيجي — مع فهم عميق للأنظمة المستقلة والتفكير المنظومي.',
          stat: '٢٢٥ يورو/س',
          statLabel: 'سعر الاستشارة',
        },
        {
          number: 'II',
          title: 'الطبيعة',
          subtitle: 'TaigaSchool',
          body: 'ضيافة بيئية تجديدية في برية كوسامو. أكواخ فاخرة وتجارب الشفق القطبي والانغمار العميق في الغابات. حيث تلتقي غابة التايغا القديمة بالملاذ المعاصر.',
          stat: '١٨٠ هكتار',
          statLabel: 'غابة بكر',
        },
        {
          number: 'III',
          title: 'البحرية',
          subtitle: 'Van Diemen AOS',
          body: 'إعادة تدوير السفن المتقدمة وإيقاف تشغيل السفن البحرية. ريادة حلول نهاية العمر المستدامة للأسطول العالمي بمنهجية Primal AOS. هدم مسؤول يحوّل التراث البحري إلى قيمة قابلة للاسترداد.',
          stat: '٥٠ ألف يورو',
          statLabel: 'أول عقد',
        },
        {
          number: 'IV',
          title: 'الاستشارات',
          subtitle: 'WorldLine · AI أول',
          body: 'استشارات ذكاء اصطناعي رفيعة المستوى لـ WorldLine، إحدى الشركات الرائدة في أوروبا في تكنولوجيا المدفوعات. هندسة الأنظمة، تصميم الوكلاء المستقلين، وتطبيق الذكاء الاصطناعي على مستوى المؤسسات.',
          stat: '٢٠٢٦',
          statLabel: 'مشروع نشط',
        },
        {
          number: 'V',
          title: 'المنصة',
          subtitle: 'Solvari Design',
          body: 'هندسة نظام التصميم وتكامل الذكاء الاصطناعي لأكبر منصة لتحسين المنازل في بلجيكا ولوكسمبورغ وهولندا. لغة تصميم مستوحاة من Apple، بنية تحتية جاهزة للوكلاء.',
          stat: '٢٠٢٦',
          statLabel: 'نظام التصميم',
        },
      ],
    },
    heritage: {
      label: 'تراثنا',
      motto: '\u201Cلومين فيليسيس\u201D',
      mottoTranslation: 'نور الحظ',
      values: [
        { latin: 'Prudentia', english: 'الحكمة', icon: '◈', text: 'نقيس مرتين ونتصرف بقناعة. الصبر الاستراتيجي هو ميزتنا التنافسية.' },
        { latin: 'Integritas', english: 'النزاهة', icon: '◇', text: 'كلمتنا هي عهدنا. في كل ولاية قضائية، كل شراكة، كل مصافحة.' },
        { latin: 'Fortitudo', english: 'الصلابة', icon: '△', text: 'نبني لعقود لا لأرباع سنوية. الثروة الحقيقية تتراكم من خلال المرونة.' },
        { latin: 'Humanitas', english: 'الإنسانية', icon: '○', text: 'التكنولوجيا تخدم الناس. الطبيعة ترعى الناس. كل كائن حي يستحق الكرامة.' },
      ],
    },
    philanthropy: {
      label: 'المؤسسة',
      title: 'الأرواح التي',
      titleAccent: 'تهمّ أكثر',
      intro: 'وراء الأعمال التجارية، تحمل مجموعة رينك التزاماً أساسياً برفاهية أولئك الذين لا يستطيعون التحدث عن أنفسهم. مهمتنا الخيرية شخصية للغاية وغير قابلة للتفاوض.',
      dogTitle: 'مبادرة رعاية الكلاب',
      dogBody: 'حياة الكلاب وعافيتها وكرامتها هي أحد أهدافنا التأسيسية الأساسية. نؤمن أن الحضارة تُقاس بكيفية معاملتها لرفاقها الأكثر وفاءً. من عمليات الإنقاذ إلى تمويل الملاجئ، ومن برامج الرعاية البيطرية إلى المناصرة — نستثمر في عالم يعرف فيه كل كلب الأمان والدفء والحب.',
      dogStat: '∞',
      dogStatLabel: 'غير مشروط',
      quote: '"يمكن الحكم على عظمة أمة من خلال الطريقة التي تُعامَل بها حيواناتها." — المهاتما غاندي',
    },
    contact: {
      label: 'تواصل',
      title: 'ابدأ',
      titleAccent: 'الحوار',
      body: 'لاستفسارات الشراكة وفرص الاستثمار أو التعاون الاستراتيجي.',
    },
    footer: {
      copyright: 'Rink Group OY',
    },
    langSwitch: {
      en: 'EN',
      fi: 'FI',
      ar: 'عربي',
    },
  },
};
