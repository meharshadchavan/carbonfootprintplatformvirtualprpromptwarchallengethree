/* ============================================
   CarbonWise — Advanced Application Logic
   ============================================ */

(function () {
    'use strict';

    // ===== STATE =====
    const state = {
        lang: 'en',
        currentStep: 1,
        totalSteps: 4,
        inputs: {
            vehicleType: 'gasoline', weeklyMiles: 100, flightsPerYear: 2, publicTransit: 'no',
            electricityBill: 120, heatingSource: 'natural-gas', homeSize: 1500, renewableEnergy: 'no',
            dietType: 'average', localFood: 'rarely', foodWaste: 'some',
            spendingHabits: 'moderate', recycling: 'no', secondHand: 'never'
        },
        results: null,
        completedActions: JSON.parse(localStorage.getItem('cw_completedActions') || '[]'),
        points: parseInt(localStorage.getItem('cw_points') || '0', 10)
    };

    // ===== I18N DICTIONARIES (Dual Engine: 5 Languages) =====
    const I18N = {
        en: {
            nav_home: "Home", nav_calculator: "Calculator", nav_dashboard: "Dashboard", nav_actions: "Actions",
            cmd_placeholder: "Try 'I drive electric' or 'Show my dashboard'...", cmd_submit: "Submit",
            hero_badge: "Track your environmental impact", hero_title_1: "Understand Your", hero_title_2: "Carbon Footprint",
            hero_subtitle: "Take control of your environmental impact. Calculate, track, and reduce your footprint with personalized insights.",
            btn_calc: "Calculate My Footprint", btn_learn: "Learn More", scroll_down: "Scroll to explore",
            unit_tons: "tons CO₂", stat_global: "Global Avg / Person", stat_us: "US Average / Person", stat_target: "Target by 2050",
            tag_calc: "Carbon Calculator", calc_title_1: "Calculate Your", calc_title_2: "Footprint", calc_desc: "Answer a few questions to get an estimate.",
            step_transport: "Transport", step_energy: "Energy", step_diet: "Diet", step_lifestyle: "Lifestyle",
            q_transport_title: "Transportation", q_transport_desc: "How do you get around?",
            lbl_vehicle: "What type of vehicle do you primarily drive?", opt_gas: "Gasoline", opt_diesel: "Diesel", opt_hybrid: "Hybrid", opt_ev: "Electric", opt_none: "No Car",
            lbl_miles: "Weekly driving distance (miles)", lbl_mi_week: "mi/week", lbl_flights: "Number of round-trip flights per year", lbl_flights_yr: "flights/year",
            lbl_transit: "Do you use public transit regularly?", opt_no: "No", opt_sometimes: "Sometimes", opt_daily: "Daily",
            q_energy_title: "Home Energy", q_energy_desc: "Your home energy use is a major part of your footprint.",
            lbl_elec_bill: "Monthly electricity bill ($)", lbl_month: "month", lbl_heat: "Primary heating source", opt_natgas: "Natural Gas", opt_elecheat: "Electric", opt_oil: "Oil", opt_renew: "Renewable",
            lbl_homesize: "Home size (sq ft)", lbl_sqft: "sq ft", lbl_renew_use: "Do you use renewable energy?", opt_partial: "Partially", opt_yes100: "Yes, 100%",
            q_diet_title: "Diet & Food", q_diet_desc: "What you eat matters.", lbl_diet: "How would you describe your diet?",
            opt_heavymeat: "Heavy Meat", opt_avgmeat: "Average", opt_lowmeat: "Low Meat", opt_veg: "Vegetarian", opt_vegan: "Vegan",
            lbl_local: "How often do you buy locally-sourced food?", opt_rarely: "Rarely", opt_mostly: "Mostly",
            lbl_waste: "How much food do you typically waste?", opt_alot: "A Lot", opt_some: "Some", opt_minimal: "Minimal",
            q_life_title: "Lifestyle", q_life_desc: "Shopping and waste habits.", lbl_spend: "How much do you spend on new goods?",
            opt_minspend: "Minimal", opt_modspend: "Moderate", opt_highspend: "High", lbl_recycle: "Do you recycle and compost?", opt_reconly: "Recycle Only", opt_both: "Both",
            lbl_secondhand: "How often do you buy second-hand?", opt_never: "Never", opt_often: "Often",
            btn_prev: "Previous", btn_next: "Next", btn_submit: "See My Results",
            tag_results: "Your Results", dash_title_1: "Your Carbon", dash_title_2: "Dashboard", dash_desc: "Breakdown of your footprint.", btn_speak_results: "Read Results",
            lbl_total_footprint: "Your Annual Carbon Footprint", unit_tons_yr: "tons CO₂e/year", marker_you: "You", marker_avg: "US Avg", marker_target: "Target",
            dash_breakdown: "Breakdown by Category", unit_tons_short: "tons", dash_bars: "Emissions by Category", dash_equiv: "What Your Footprint Equals",
            equiv_trees: "Trees needed to offset", equiv_driving: "Miles of driving", equiv_bulbs: "LED bulbs (year)", equiv_flights: "NY→London flights",
            dash_recalc_msg: "Not happy with the results? Adjust inputs.", btn_recalc: "Recalculate",
            tag_actions: "Take Action", act_title_1: "Reduce Your", act_title_2: "Impact", act_desc: "Personalized actions based on footprint.",
            lbl_points: "Points", lbl_level: "Level",
            tab_all: "All", tab_transport: "🚗 Transport", tab_energy: "⚡ Energy", tab_diet: "🥗 Diet", tab_lifestyle: "🏠 Lifestyle",
            footer_text: "Built to inspire climate action. Every small step counts."
        },
        hi: {
            nav_home: "होम", nav_calculator: "कैलक्यूलेटर", nav_dashboard: "डैशबोर्ड", nav_actions: "कार्रवाइयां",
            cmd_placeholder: "बोलें 'मैं इलेक्ट्रिक चलाता हूं' या 'मेरा डैशबोर्ड दिखाएं'...", cmd_submit: "जमा करें",
            hero_badge: "अपने पर्यावरणीय प्रभाव को ट्रैक करें", hero_title_1: "अपना समझें", hero_title_2: "कार्बन फुटप्रिंट",
            hero_subtitle: "अपने पर्यावरणीय प्रभाव को नियंत्रित करें। गणना करें, ट्रैक करें और कम करें।",
            btn_calc: "मेरा फुटप्रिंट मापें", btn_learn: "और जानें", scroll_down: "नीचे स्क्रॉल करें",
            unit_tons: "टन CO₂", stat_global: "वैश्विक औसत", stat_us: "अमेरिकी औसत", stat_target: "2050 का लक्ष्य",
            tag_calc: "कार्बन कैलक्यूलेटर", calc_title_1: "गणना करें अपना", calc_title_2: "फुटप्रिंट", calc_desc: "कुछ सवालों के जवाब दें।",
            step_transport: "परिवहन", step_energy: "ऊर्जा", step_diet: "आहार", step_lifestyle: "जीवनशैली",
            q_transport_title: "परिवहन", q_transport_desc: "आप कैसे यात्रा करते हैं?",
            lbl_vehicle: "आप मुख्य रूप से कौन सा वाहन चलाते हैं?", opt_gas: "पेट्रोल", opt_diesel: "डीजल", opt_hybrid: "हाइब्रिड", opt_ev: "इलेक्ट्रिक", opt_none: "वाहन नहीं",
            lbl_miles: "साप्ताहिक ड्राइविंग दूरी (मील)", lbl_mi_week: "मील/सप्ताह", lbl_flights: "प्रति वर्ष उड़ानें", lbl_flights_yr: "उड़ानें/वर्ष",
            lbl_transit: "क्या आप सार्वजनिक परिवहन का उपयोग करते हैं?", opt_no: "नहीं", opt_sometimes: "कभी-कभी", opt_daily: "रोजाना",
            q_energy_title: "घर की ऊर्जा", q_energy_desc: "घरेलू ऊर्जा का उपयोग बड़ा हिस्सा है।",
            lbl_elec_bill: "मासिक बिजली बिल ($)", lbl_month: "महीना", lbl_heat: "मुख्य हीटिंग स्रोत", opt_natgas: "प्राकृतिक गैस", opt_elecheat: "विद्युत", opt_oil: "तेल", opt_renew: "अक्षय",
            lbl_homesize: "घर का आकार (sq ft)", lbl_sqft: "वर्ग फुट", lbl_renew_use: "क्या आप अक्षय ऊर्जा का उपयोग करते हैं?", opt_partial: "आंशिक रूप से", opt_yes100: "हाँ, 100%",
            q_diet_title: "आहार और भोजन", q_diet_desc: "आप क्या खाते हैं, यह मायने रखता है।", lbl_diet: "आपका आहार कैसा है?",
            opt_heavymeat: "भारी मांस", opt_avgmeat: "औसत", opt_lowmeat: "कम मांस", opt_veg: "शाकाहारी", opt_vegan: "पूर्ण शाकाहारी",
            lbl_local: "आप कितनी बार स्थानीय भोजन खरीदते हैं?", opt_rarely: "शायद ही कभी", opt_mostly: "अधिकतर",
            lbl_waste: "आप कितना भोजन बर्बाद करते हैं?", opt_alot: "बहुत", opt_some: "कुछ", opt_minimal: "न्यूनतम",
            q_life_title: "जीवनशैली", q_life_desc: "खरीदारी की आदतें।", lbl_spend: "आप नए सामान पर कितना खर्च करते हैं?",
            opt_minspend: "न्यूनतम", opt_modspend: "मध्यम", opt_highspend: "उच्च", lbl_recycle: "क्या आप रीसायकल करते हैं?", opt_reconly: "केवल रीसायकल", opt_both: "दोनों",
            lbl_secondhand: "आप पुराना सामान कितनी बार खरीदते हैं?", opt_never: "कभी नहीं", opt_often: "अक्सर",
            btn_prev: "पिछला", btn_next: "अगला", btn_submit: "परिणाम देखें",
            tag_results: "आपके परिणाम", dash_title_1: "आपका कार्बन", dash_title_2: "डैशबोर्ड", dash_desc: "आपके फुटप्रिंट का विवरण।", btn_speak_results: "परिणाम बोलें",
            lbl_total_footprint: "आपका वार्षिक कार्बन फुटप्रिंट", unit_tons_yr: "टन CO₂e/वर्ष", marker_you: "आप", marker_avg: "अमेरिकी औसत", marker_target: "लक्ष्य",
            dash_breakdown: "श्रेणी के अनुसार विवरण", unit_tons_short: "टन", dash_bars: "उत्सर्जन श्रेणियां", dash_equiv: "यह किसके बराबर है",
            equiv_trees: "पेड़ों की आवश्यकता", equiv_driving: "ड्राइविंग मील", equiv_bulbs: "एलईडी बल्ब (वर्ष)", equiv_flights: "उड़ानें",
            dash_recalc_msg: "परिणाम से खुश नहीं? इनपुट बदलें।", btn_recalc: "पुनर्गणना",
            tag_actions: "कार्रवाई करें", act_title_1: "अपना प्रभाव", act_title_2: "कम करें", act_desc: "सुझाए गए कार्य।",
            lbl_points: "अंक", lbl_level: "स्तर",
            tab_all: "सभी", tab_transport: "🚗 परिवहन", tab_energy: "⚡ ऊर्जा", tab_diet: "🥗 आहार", tab_lifestyle: "🏠 जीवनशैली",
            footer_text: "हर छोटा कदम मायने रखता है।"
        },
        mr: {
            nav_home: "होम", nav_calculator: "कॅल्क्युलेटर", nav_dashboard: "डॅशबोर्ड", nav_actions: "कृती",
            cmd_placeholder: "'मी इलेक्ट्रिक गाडी चालवतो' बोलून पहा...", cmd_submit: "सबमिट करा",
            hero_badge: "तुमचा पर्यावरणावरील प्रभाव तपासा", hero_title_1: "तुमचा", hero_title_2: "कार्बन फुटप्रिंट समजून घ्या",
            hero_subtitle: "तुमच्या पर्यावरणावरील प्रभावावर नियंत्रण ठेवा. मोजणी करा आणि कमी करा.",
            btn_calc: "माझा फुटप्रिंट मोजा", btn_learn: "अधिक जाणून घ्या", scroll_down: "खाली स्क्रोल करा",
            unit_tons: "टन CO₂", stat_global: "जागतिक सरासरी", stat_us: "अमेरिकन सरासरी", stat_target: "2050 चे उद्दिष्ट",
            tag_calc: "कार्बन कॅल्क्युलेटर", calc_title_1: "तुमचा", calc_title_2: "फुटप्रिंट मोजा", calc_desc: "काही प्रश्नांची उत्तरे द्या.",
            step_transport: "वाहतूक", step_energy: "ऊर्जा", step_diet: "आहार", step_lifestyle: "जीवनशैली",
            q_transport_title: "वाहतूक", q_transport_desc: "तुम्ही प्रवास कसा करता?",
            lbl_vehicle: "तुम्ही प्रामुख्याने कोणते वाहन चालवता?", opt_gas: "पेट्रोल", opt_diesel: "डिझेल", opt_hybrid: "हायब्रिड", opt_ev: "इलेक्ट्रिक", opt_none: "वाहन नाही",
            lbl_miles: "साप्ताहिक ड्रायव्हिंग (मैल)", lbl_mi_week: "मैल/आठवडा", lbl_flights: "प्रति वर्ष उड्डाणे", lbl_flights_yr: "उड्डाणे/वर्ष",
            lbl_transit: "तुम्ही सार्वजनिक वाहतूक वापरता का?", opt_no: "नाही", opt_sometimes: "कधीकधी", opt_daily: "रोज",
            q_energy_title: "घरातील ऊर्जा", q_energy_desc: "घरातील ऊर्जेचा वापर हा मोठा भाग आहे.",
            lbl_elec_bill: "मासिक वीज बिल ($)", lbl_month: "महिना", lbl_heat: "मुख्य हीटिंग स्रोत", opt_natgas: "नैसर्गिक गॅस", opt_elecheat: "विद्युत", opt_oil: "तेल", opt_renew: "अक्षय",
            lbl_homesize: "घराचा आकार (sq ft)", lbl_sqft: "चौरस फूट", lbl_renew_use: "तुम्ही अक्षय ऊर्जा वापरता का?", opt_partial: "अंशतः", opt_yes100: "होय, 100%",
            q_diet_title: "आहार", q_diet_desc: "तुम्ही काय खाता हे महत्त्वाचे आहे.", lbl_diet: "तुमचा आहार कसा आहे?",
            opt_heavymeat: "भरपूर मांस", opt_avgmeat: "सरासरी", opt_lowmeat: "कमी मांस", opt_veg: "शाकाहारी", opt_vegan: "पूर्ण शाकाहारी",
            lbl_local: "तुम्ही किती वेळा स्थानिक अन्न खरेदी करता?", opt_rarely: "क्वचितच", opt_mostly: "बहुतेक",
            lbl_waste: "तुम्ही किती अन्न वाया घालवता?", opt_alot: "खूप", opt_some: "काही", opt_minimal: "किमान",
            q_life_title: "जीवनशैली", q_life_desc: "खरेदीच्या सवयी.", lbl_spend: "तुम्ही नवीन वस्तूंवर किती खर्च करता?",
            opt_minspend: "किमान", opt_modspend: "मध्यम", opt_highspend: "जास्त", lbl_recycle: "तुम्ही रिसायकल करता का?", opt_reconly: "फक्त रिसायकल", opt_both: "दोन्ही",
            lbl_secondhand: "तुम्ही जुन्या वस्तू किती वेळा खरेदी करता?", opt_never: "कधीच नाही", opt_often: "अनेकदा",
            btn_prev: "मागे", btn_next: "पुढे", btn_submit: "निकाल पहा",
            tag_results: "तुमचे निकाल", dash_title_1: "तुमचा कार्बन", dash_title_2: "डॅशबोर्ड", dash_desc: "तुमच्या फुटप्रिंटचा तपशील.", btn_speak_results: "निकाल वाचा",
            lbl_total_footprint: "तुमचा वार्षिक कार्बन फुटप्रिंट", unit_tons_yr: "टन CO₂e/वर्ष", marker_you: "तुम्ही", marker_avg: "US सरासरी", marker_target: "उद्दिष्ट",
            dash_breakdown: "श्रेणीनुसार तपशील", unit_tons_short: "टन", dash_bars: "उत्सर्जन श्रेणी", dash_equiv: "हे कशाच्या समान आहे",
            equiv_trees: "आवश्यक झाडे", equiv_driving: "ड्रायव्हिंग मैल", equiv_bulbs: "LED बल्ब (वर्ष)", equiv_flights: "उड्डाणे",
            dash_recalc_msg: "निकाल आवडला नाही? इनपुट बदला.", btn_recalc: "पुन्हा मोजा",
            tag_actions: "कृती करा", act_title_1: "तुमचा प्रभाव", act_title_2: "कमी करा", act_desc: "सुचवलेल्या कृती.",
            lbl_points: "पॉइंट्स", lbl_level: "स्तर",
            tab_all: "सर्व", tab_transport: "🚗 वाहतूक", tab_energy: "⚡ ऊर्जा", tab_diet: "🥗 आहार", tab_lifestyle: "🏠 जीवनशैली",
            footer_text: "प्रत्येक लहान पाऊल महत्त्वाचे आहे."
        },
        es: {
            nav_home: "Inicio", nav_calculator: "Calculadora", nav_dashboard: "Panel", nav_actions: "Acciones",
            cmd_placeholder: "Prueba 'Conduzco eléctrico' o 'Muestra panel'...", cmd_submit: "Enviar",
            hero_badge: "Rastrea tu impacto ambiental", hero_title_1: "Comprende Tu", hero_title_2: "Huella de Carbono",
            hero_subtitle: "Toma el control de tu impacto ambiental. Calcula, rastrea y reduce.",
            btn_calc: "Calcular Huella", btn_learn: "Saber más", scroll_down: "Desplázate hacia abajo",
            unit_tons: "tons CO₂", stat_global: "Promedio Global", stat_us: "Promedio EE.UU.", stat_target: "Meta 2050",
            tag_calc: "Calculadora de Carbono", calc_title_1: "Calcula Tu", calc_title_2: "Huella", calc_desc: "Responde algunas preguntas.",
            step_transport: "Transporte", step_energy: "Energía", step_diet: "Dieta", step_lifestyle: "Estilo de vida",
            q_transport_title: "Transporte", q_transport_desc: "¿Cómo te desplazas?",
            lbl_vehicle: "¿Qué tipo de vehículo conduces?", opt_gas: "Gasolina", opt_diesel: "Diésel", opt_hybrid: "Híbrido", opt_ev: "Eléctrico", opt_none: "Sin Coche",
            lbl_miles: "Distancia semanal (millas)", lbl_mi_week: "mi/sem", lbl_flights: "Vuelos anuales", lbl_flights_yr: "vuelos/año",
            lbl_transit: "¿Usas transporte público?", opt_no: "No", opt_sometimes: "A veces", opt_daily: "Diario",
            q_energy_title: "Energía del Hogar", q_energy_desc: "El uso de energía es importante.",
            lbl_elec_bill: "Factura eléctrica mensual ($)", lbl_month: "mes", lbl_heat: "Fuente de calefacción", opt_natgas: "Gas Natural", opt_elecheat: "Eléctrico", opt_oil: "Petróleo", opt_renew: "Renovable",
            lbl_homesize: "Tamaño hogar (sq ft)", lbl_sqft: "sq ft", lbl_renew_use: "¿Usas energía renovable?", opt_partial: "Parcial", opt_yes100: "Sí, 100%",
            q_diet_title: "Dieta", q_diet_desc: "Lo que comes importa.", lbl_diet: "¿Cómo es tu dieta?",
            opt_heavymeat: "Mucha carne", opt_avgmeat: "Promedio", opt_lowmeat: "Poca carne", opt_veg: "Vegetariano", opt_vegan: "Vegano",
            lbl_local: "¿Compras comida local?", opt_rarely: "Raramente", opt_mostly: "Casi siempre",
            lbl_waste: "¿Cuánto alimento desperdicias?", opt_alot: "Mucho", opt_some: "Algo", opt_minimal: "Mínimo",
            q_life_title: "Estilo de vida", q_life_desc: "Tus hábitos de consumo.", lbl_spend: "¿Cuánto gastas en bienes?",
            opt_minspend: "Mínimo", opt_modspend: "Moderado", opt_highspend: "Alto", lbl_recycle: "¿Reciclas?", opt_reconly: "Solo reciclar", opt_both: "Ambos",
            lbl_secondhand: "¿Compras de segunda mano?", opt_never: "Nunca", opt_often: "A menudo",
            btn_prev: "Anterior", btn_next: "Siguiente", btn_submit: "Ver Resultados",
            tag_results: "Tus Resultados", dash_title_1: "Tu Panel", dash_title_2: "de Carbono", dash_desc: "Desglose de tu huella.", btn_speak_results: "Leer Resultados",
            lbl_total_footprint: "Tu Huella Anual", unit_tons_yr: "tons CO₂/año", marker_you: "Tú", marker_avg: "Promedio EE.UU.", marker_target: "Meta",
            dash_breakdown: "Desglose por Categoría", unit_tons_short: "tons", dash_bars: "Emisiones", dash_equiv: "A qué equivale",
            equiv_trees: "Árboles necesarios", equiv_driving: "Millas en auto", equiv_bulbs: "Bombillas LED", equiv_flights: "Vuelos NY→Londres",
            dash_recalc_msg: "¿No te gustan los resultados? Ajusta tus entradas.", btn_recalc: "Recalcular",
            tag_actions: "Actúa", act_title_1: "Reduce Tu", act_title_2: "Impacto", act_desc: "Acciones personalizadas.",
            lbl_points: "Puntos", lbl_level: "Nivel",
            tab_all: "Todo", tab_transport: "🚗 Transporte", tab_energy: "⚡ Energía", tab_diet: "🥗 Dieta", tab_lifestyle: "🏠 Estilo",
            footer_text: "Cada pequeño paso cuenta para un futuro sostenible."
        },
        fr: {
            nav_home: "Accueil", nav_calculator: "Calculatrice", nav_dashboard: "Tableau de Bord", nav_actions: "Actions",
            cmd_placeholder: "Essayez 'Je conduis électrique' ou 'Mon tableau de bord'...", cmd_submit: "Envoyer",
            hero_badge: "Suivez votre impact environnemental", hero_title_1: "Comprenez Votre", hero_title_2: "Empreinte Carbone",
            hero_subtitle: "Prenez le contrôle de votre impact environnemental. Calculez, suivez et réduisez.",
            btn_calc: "Calculer Mon Empreinte", btn_learn: "En Savoir Plus", scroll_down: "Faites défiler",
            unit_tons: "tonnes CO₂", stat_global: "Moyenne Mondiale", stat_us: "Moyenne US", stat_target: "Objectif 2050",
            tag_calc: "Calculatrice Carbone", calc_title_1: "Calculez Votre", calc_title_2: "Empreinte", calc_desc: "Répondez à quelques questions.",
            step_transport: "Transport", step_energy: "Énergie", step_diet: "Alimentation", step_lifestyle: "Mode de vie",
            q_transport_title: "Transport", q_transport_desc: "Comment vous déplacez-vous ?",
            lbl_vehicle: "Quel véhicule conduisez-vous ?", opt_gas: "Essence", opt_diesel: "Diesel", opt_hybrid: "Hybride", opt_ev: "Électrique", opt_none: "Pas de Voiture",
            lbl_miles: "Distance hebdomadaire (miles)", lbl_mi_week: "mi/sem", lbl_flights: "Vols annuels", lbl_flights_yr: "vols/an",
            lbl_transit: "Utilisez-vous les transports en commun ?", opt_no: "Non", opt_sometimes: "Parfois", opt_daily: "Quotidien",
            q_energy_title: "Énergie Domestique", q_energy_desc: "L'énergie est une part majeure.",
            lbl_elec_bill: "Facture d'électricité ($)", lbl_month: "mois", lbl_heat: "Chauffage principal", opt_natgas: "Gaz Naturel", opt_elecheat: "Électrique", opt_oil: "Fioul", opt_renew: "Renouvelable",
            lbl_homesize: "Taille du logement (sq ft)", lbl_sqft: "sq ft", lbl_renew_use: "Utilisez-vous l'énergie renouvelable ?", opt_partial: "Partiellement", opt_yes100: "Oui, 100%",
            q_diet_title: "Alimentation", q_diet_desc: "Ce que vous mangez compte.", lbl_diet: "Décrivez votre régime :",
            opt_heavymeat: "Beaucoup de viande", opt_avgmeat: "Moyen", opt_lowmeat: "Peu de viande", opt_veg: "Végétarien", opt_vegan: "Végan",
            lbl_local: "Achetez-vous local ?", opt_rarely: "Rarement", opt_mostly: "Surtout",
            lbl_waste: "Quel est votre gaspillage alimentaire ?", opt_alot: "Beaucoup", opt_some: "Un peu", opt_minimal: "Minimal",
            q_life_title: "Mode de vie", q_life_desc: "Vos habitudes d'achat.", lbl_spend: "Combien dépensez-vous ?",
            opt_minspend: "Minimal", opt_modspend: "Modéré", opt_highspend: "Élevé", lbl_recycle: "Recyclez-vous ?", opt_reconly: "Seulement Recyclage", opt_both: "Les Deux",
            lbl_secondhand: "Achetez-vous d'occasion ?", opt_never: "Jamais", opt_often: "Souvent",
            btn_prev: "Précédent", btn_next: "Suivant", btn_submit: "Voir les Résultats",
            tag_results: "Vos Résultats", dash_title_1: "Votre Tableau", dash_title_2: "de Bord", dash_desc: "Répartition de votre empreinte.", btn_speak_results: "Lire les Résultats",
            lbl_total_footprint: "Votre Empreinte Annuelle", unit_tons_yr: "tonnes CO₂/an", marker_you: "Vous", marker_avg: "Moyenne US", marker_target: "Objectif",
            dash_breakdown: "Répartition", unit_tons_short: "tonnes", dash_bars: "Émissions par Catégorie", dash_equiv: "Équivalences",
            equiv_trees: "Arbres nécessaires", equiv_driving: "Miles en voiture", equiv_bulbs: "Ampoules LED", equiv_flights: "Vols NY→Londres",
            dash_recalc_msg: "Pas satisfait ? Ajustez les données.", btn_recalc: "Recalculer",
            tag_actions: "Agir", act_title_1: "Réduisez Votre", act_title_2: "Impact", act_desc: "Actions personnalisées.",
            lbl_points: "Points", lbl_level: "Niveau",
            tab_all: "Tout", tab_transport: "🚗 Transport", tab_energy: "⚡ Énergie", tab_diet: "🥗 Alimentation", tab_lifestyle: "🏠 Mode de vie",
            footer_text: "Chaque petit geste compte pour un avenir durable."
        }
    };


    // ===== EMISSION FACTORS =====
    const EMISSION_FACTORS = {
        vehicle: { gasoline: 0.000404, diesel: 0.000448, hybrid: 0.000220, electric: 0.000100, none: 0 },
        flight: 0.9, publicTransit: { no: 0, sometimes: -0.3, daily: -0.8 },
        electricity: { perDollar: 0.00567 }, heating: { 'natural-gas': 2.2, electric: 1.5, oil: 3.0, renewable: 0.2 },
        homeSizeFactor: { base: 1500 }, renewableDiscount: { no: 1.0, partial: 0.6, yes: 0.15 },
        diet: { 'heavy-meat': 3.3, average: 2.5, 'low-meat': 1.9, vegetarian: 1.7, vegan: 1.5 },
        localFood: { rarely: 0, sometimes: -0.1, mostly: -0.25 }, foodWaste: { 'a-lot': 0.4, some: 0.2, minimal: 0.05 },
        spending: { minimal: 0.5, moderate: 1.2, high: 2.5 }, recycling: { no: 0, 'recycle-only': -0.15, both: -0.35 },
        secondHand: { never: 0, sometimes: -0.1, often: -0.25 }
    };


    // ===== ACTIONS & BADGES DATA =====
    const ACTIONS = [
        { id: 'a1', category: 'transport', title: 'Walk or bike for short trips', desc: 'Replace car trips under 2 miles.', impact: 'high', points: 50, savingTons: 0.5 },
        { id: 'a2', category: 'transport', title: 'Carpool to work', desc: 'Share your commute.', impact: 'medium', points: 30, savingTons: 0.3 },
        { id: 'a3', category: 'transport', title: 'Take one fewer flight', desc: 'Saves nearly 1 ton of CO₂.', impact: 'high', points: 75, savingTons: 0.9 },
        { id: 'a4', category: 'transport', title: 'Use public transit', desc: 'Produce far less emissions.', impact: 'medium', points: 40, savingTons: 0.4 },
        { id: 'a5', category: 'energy', title: 'Switch to LED bulbs', desc: 'Use 75% less energy.', impact: 'medium', points: 25, savingTons: 0.2 },
        { id: 'a6', category: 'energy', title: 'Lower thermostat', desc: 'Saves energy over a year.', impact: 'medium', points: 30, savingTons: 0.3 },
        { id: 'a7', category: 'energy', title: 'Green energy provider', desc: 'Choose 100% renewable electricity.', impact: 'high', points: 80, savingTons: 1.5 },
        { id: 'a8', category: 'energy', title: 'Unplug devices', desc: 'Stop phantom power draws.', impact: 'low', points: 15, savingTons: 0.1 },
        { id: 'a9', category: 'diet', title: 'Meatless Monday', desc: 'Going meat-free one day a week.', impact: 'medium', points: 35, savingTons: 0.3 },
        { id: 'a10', category: 'diet', title: 'Reduce food waste', desc: 'Compost scraps and plan meals.', impact: 'medium', points: 30, savingTons: 0.25 },
        { id: 'a11', category: 'diet', title: 'Buy local produce', desc: 'Fewer food miles.', impact: 'low', points: 20, savingTons: 0.15 },
        { id: 'a12', category: 'diet', title: 'Grow your own herbs', desc: 'Cut transport emissions.', impact: 'low', points: 20, savingTons: 0.1 },
        { id: 'a13', category: 'lifestyle', title: 'Buy second-hand clothing', desc: 'Fashion produces 10% of global emissions.', impact: 'medium', points: 30, savingTons: 0.3 },
        { id: 'a14', category: 'lifestyle', title: 'Start composting', desc: 'Reduces landfill methane.', impact: 'medium', points: 25, savingTons: 0.2 },
        { id: 'a15', category: 'lifestyle', title: 'Recycle consistently', desc: 'Saves raw materials.', impact: 'low', points: 15, savingTons: 0.15 },
        { id: 'a16', category: 'lifestyle', title: 'Reusable water bottle', desc: 'Reduce plastic waste.', impact: 'low', points: 15, savingTons: 0.05 }
    ];

    const BADGES = [
        { id: 'b1', icon: '🌱', name: 'First Step', desc: 'Complete first action', threshold: 1 },
        { id: 'b2', icon: '🔥', name: 'On Fire', desc: 'Complete 3 actions', threshold: 3 },
        { id: 'b3', icon: '🌍', name: 'Eco Warrior', desc: 'Complete 5 actions', threshold: 5 },
        { id: 'b4', icon: '⭐', name: 'Star Saver', desc: 'Earn 100 points', thresholdPoints: 100 },
        { id: 'b5', icon: '🏆', name: 'Champion', desc: 'Complete 10 actions', threshold: 10 },
        { id: 'b6', icon: '💎', name: 'Carbon Master', desc: 'Earn 500 points', thresholdPoints: 500 }
    ];


    // ===== DOM REFERENCES =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);


    // ===== INITIALIZATION =====
    function init() {
        setupI18N();
        setupNavigation();
        setupHeroAnimations();
        setupCalculator();
        setupSliders();
        setupOptionCards();
        setupToggleButtons();
        setupActionTabs();
        setupAccessibility();
        setupVoiceAndIntentEngine();
        setupTestSuite();
        animateHeroStats();

        const savedResults = localStorage.getItem('cw_results');
        if (savedResults) state.results = JSON.parse(savedResults);
    }


    // ===== TRANSLATION ENGINE (I18N) =====
    function setupI18N() {
        const langSelect = $('#lang-select');
        langSelect.addEventListener('change', (e) => {
            state.lang = e.target.value;
            applyTranslations();
        });
    }

    function applyTranslations() {
        const dict = I18N[state.lang] || I18N['en'];
        $$('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        $$('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) el.setAttribute('placeholder', dict[key]);
        });
        
        if (state.results) renderTotalFootprint(); // Re-render text logic
    }


    // ===== ACCESSIBILITY (A11Y) =====
    function setupAccessibility() {
        // Keyboard navigation for option cards and toggles
        $$('.option-card, .toggle-btn').forEach(el => {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }

    // ===== VOICE & INTENT ENGINE =====
    function setupVoiceAndIntentEngine() {
        const voiceBtn = $('#voice-btn');
        const intentInput = $('#intent-input');
        const submitBtn = $('#intent-submit-btn');
        const feedback = $('#command-feedback');

        // Speech Synthesis
        $('#speak-results-btn').addEventListener('click', () => {
            if (!state.results) return;
            const msg = new SpeechSynthesisUtterance();
            msg.text = `Your estimated annual carbon footprint is ${state.results.total} tons. The US average is 14.7 tons.`;
            msg.lang = state.lang === 'hi' ? 'hi-IN' : state.lang === 'es' ? 'es-ES' : state.lang === 'fr' ? 'fr-FR' : 'en-US';
            window.speechSynthesis.speak(msg);
        });

        // Speech Recognition (if available)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => voiceBtn.classList.add('listening');
            recognition.onend = () => voiceBtn.classList.remove('listening');
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                intentInput.value = transcript;
                processIntent(transcript);
            };
        } else {
            voiceBtn.style.display = 'none'; // Hide if not supported
        }

        voiceBtn.addEventListener('click', () => {
            if (recognition) {
                try { recognition.start(); } catch(e) {}
            }
        });

        submitBtn.addEventListener('click', () => {
            if (intentInput.value.trim()) processIntent(intentInput.value);
        });

        intentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && intentInput.value.trim()) {
                processIntent(intentInput.value);
            }
        });

        function processIntent(text) {
            text = text.toLowerCase();
            let response = "Command not recognized.";
            let success = false;

            // Simple heuristic intent parsing
            if (text.includes("electric")) {
                selectOption('vehicle-type', 'electric', 'vehicleType');
                response = "Vehicle set to Electric."; success = true;
            } else if (text.includes("hybrid")) {
                selectOption('vehicle-type', 'hybrid', 'vehicleType');
                response = "Vehicle set to Hybrid."; success = true;
            } else if (text.match(/(\d+)\s*miles/)) {
                const miles = text.match(/(\d+)\s*miles/)[1];
                updateSlider('weekly-miles', miles, 'weeklyMiles');
                response = `Weekly miles set to ${miles}.`; success = true;
            } else if (text.includes("dashboard") || text.includes("results")) {
                if (state.currentStep === state.totalSteps) {
                    $('#calc-submit-btn').click();
                } else {
                    navigateToSection('dashboard');
                }
                response = "Showing dashboard."; success = true;
            } else if (text.includes("next")) {
                $('#calc-next-btn').click();
                response = "Moving to next step."; success = true;
            }

            // Show feedback
            feedback.textContent = response;
            feedback.classList.add('show');
            setTimeout(() => feedback.classList.remove('show'), 3000);
            
            if (success) intentInput.value = '';
        }

        function selectOption(containerId, value, stateKey) {
            const container = $(`#${containerId}`);
            if(!container) return;
            const target = container.querySelector(`[data-value="${value}"]`);
            if (target) target.click();
        }

        function updateSlider(sliderId, value, stateKey) {
            const slider = $(`#${sliderId}`);
            if (slider) {
                slider.value = value;
                slider.dispatchEvent(new Event('input'));
            }
        }
    }


    // ===== NAVIGATION & CORE =====
    function setupNavigation() {
        window.addEventListener('scroll', () => {
            const nav = $('#app-nav');
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });

        $$('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToSection(link.dataset.section);
            });
        });

        $('#start-calculator-btn').addEventListener('click', () => navigateToSection('calculator'));
        $('#learn-more-btn').addEventListener('click', () => navigateToSection('calculator'));
        $('#recalculate-btn').addEventListener('click', () => {
            navigateToSection('calculator');
            state.currentStep = 1;
            updateCalculatorStep();
        });
    }

    function navigateToSection(sectionName) {
        const sectionEl = $(`#${sectionName}-section`);
        if (!sectionEl) return;
        sectionEl.classList.remove('hidden');
        sectionEl.scrollIntoView({ behavior: 'smooth' });
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = $(`.nav-link[data-section="${sectionName}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    // ===== HERO ANIMATIONS =====
    function setupHeroAnimations() {
        const container = $('#hero-particles');
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 4}s`;
            p.style.animationDuration = `${3 + Math.random() * 3}s`;
            const size = 2 + Math.random() * 3;
            p.style.width = `${size}px`; p.style.height = `${size}px`;
            container.appendChild(p);
        }
    }

    function animateHeroStats() {
        const statValues = $$('.hero-stat-value');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statValues.forEach(el => animateValue(el, 0, parseFloat(el.dataset.count), 1500));
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        if ($('.hero-stats')) observer.observe($('.hero-stats'));
    }

    function animateValue(el, start, end, duration) {
        const startTime = performance.now();
        const decimals = end % 1 !== 0 ? 1 : 0;
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (start + (end - start) * eased).toFixed(decimals);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ===== CALCULATOR ENGINE =====
    function setupCalculator() {
        $('#calc-next-btn').addEventListener('click', () => {
            if (state.currentStep < state.totalSteps) { state.currentStep++; updateCalculatorStep(); }
        });
        $('#calc-prev-btn').addEventListener('click', () => {
            if (state.currentStep > 1) { state.currentStep--; updateCalculatorStep(); }
        });
        $('#calc-submit-btn').addEventListener('click', () => {
            calculateFootprint();
            showDashboard();
        });
        updateCalculatorStep();
    }

    function updateCalculatorStep() {
        const step = state.currentStep;
        $$('.calc-step').forEach(s => s.classList.remove('active'));
        const activeStep = $(`#calc-step-${step}`);
        if (activeStep) activeStep.classList.add('active');

        $('#step-progress-fill').style.width = `${(step / state.totalSteps) * 100}%`;

        $$('.step-indicator').forEach(ind => {
            const indStep = parseInt(ind.dataset.step, 10);
            ind.classList.remove('active', 'completed');
            if (indStep === step) ind.classList.add('active');
            else if (indStep < step) ind.classList.add('completed');
        });

        $('#calc-prev-btn').disabled = step === 1;
        if (step === state.totalSteps) {
            $('#calc-next-btn').classList.add('hidden');
            $('#calc-submit-btn').classList.remove('hidden');
        } else {
            $('#calc-next-btn').classList.remove('hidden');
            $('#calc-submit-btn').classList.add('hidden');
        }
    }

    function setupOptionCards() {
        const mappings = {
            'vehicle-type': 'vehicleType', 'heating-source': 'heatingSource',
            'diet-type': 'dietType', 'spending-habits': 'spendingHabits'
        };
        Object.entries(mappings).forEach(([containerId, stateKey]) => {
            const container = $(`#${containerId}`);
            if (!container) return;
            container.querySelectorAll('.option-card').forEach(card => {
                if (card.dataset.value === state.inputs[stateKey]) {
                    card.classList.add('selected');
                    card.setAttribute('aria-checked', 'true');
                }
                card.addEventListener('click', () => {
                    container.querySelectorAll('.option-card').forEach(c => {
                        c.classList.remove('selected');
                        c.setAttribute('aria-checked', 'false');
                    });
                    card.classList.add('selected');
                    card.setAttribute('aria-checked', 'true');
                    state.inputs[stateKey] = card.dataset.value;
                });
            });
        });
    }

    function setupSliders() {
        const sliders = [
            { id: 'weekly-miles', valId: 'weekly-miles-val', stateKey: 'weeklyMiles' },
            { id: 'flights-year', valId: 'flights-year-val', stateKey: 'flightsPerYear' },
            { id: 'electricity-bill', valId: 'electricity-bill-val', stateKey: 'electricityBill' },
            { id: 'home-size', valId: 'home-size-val', stateKey: 'homeSize' }
        ];
        sliders.forEach(({ id, valId, stateKey }) => {
            const slider = $(`#${id}`);
            const display = $(`#${valId}`);
            if (!slider || !display) return;
            slider.value = state.inputs[stateKey];
            display.textContent = state.inputs[stateKey];
            slider.addEventListener('input', () => {
                const safeVal = Math.max(0, parseInt(slider.value, 10) || 0);
                display.textContent = safeVal;
                state.inputs[stateKey] = safeVal;
            });
        });
    }

    function setupToggleButtons() {
        const toggleMappings = [
            { btns: ['transit-no', 'transit-sometimes', 'transit-daily'], stateKey: 'publicTransit' },
            { btns: ['renewable-no', 'renewable-partial', 'renewable-yes'], stateKey: 'renewableEnergy' },
            { btns: ['local-rarely', 'local-sometimes', 'local-mostly'], stateKey: 'localFood' },
            { btns: ['waste-alot', 'waste-some', 'waste-minimal'], stateKey: 'foodWaste' },
            { btns: ['recycle-no', 'recycle-only', 'recycle-both'], stateKey: 'recycling' },
            { btns: ['secondhand-never', 'secondhand-sometimes', 'secondhand-often'], stateKey: 'secondHand' }
        ];
        toggleMappings.forEach(({ btns, stateKey }) => {
            btns.forEach(btnId => {
                const btn = $(`#${btnId}`);
                if (!btn) return;
                btn.addEventListener('click', () => {
                    const parent = btn.parentElement;
                    parent.querySelectorAll('.toggle-btn').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-checked', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-checked', 'true');
                    state.inputs[stateKey] = btn.dataset.value;
                });
            });
        });
    }

    function calculateFootprint() {
        const inp = state.inputs;
        const ef = EMISSION_FACTORS;

        const drivingEmissions = (ef.vehicle[inp.vehicleType] || 0) * inp.weeklyMiles * 52;
        const flightEmissions = ef.flight * inp.flightsPerYear;
        const transitAdjustment = ef.publicTransit[inp.publicTransit] || 0;
        const transport = Math.max(0, drivingEmissions + flightEmissions + transitAdjustment);

        const electricityBase = ef.electricity.perDollar * inp.electricityBill * 12;
        const heatingBase = ef.heating[inp.heatingSource] || 2.0;
        const homeSizeMultiplier = Math.max(1, inp.homeSize / ef.homeSizeFactor.base);
        const renewableMultiplier = ef.renewableDiscount[inp.renewableEnergy] || 1.0;
        const energy = Math.max(0, (electricityBase + heatingBase * homeSizeMultiplier) * renewableMultiplier);

        const dietBase = ef.diet[inp.dietType] || 2.5;
        const localAdj = ef.localFood[inp.localFood] || 0;
        const wasteAdj = ef.foodWaste[inp.foodWaste] || 0.2;
        const diet = Math.max(0, dietBase + localAdj + wasteAdj);

        const spendingBase = ef.spending[inp.spendingHabits] || 1.2;
        const recycleAdj = ef.recycling[inp.recycling] || 0;
        const secondHandAdj = ef.secondHand[inp.secondHand] || 0;
        const lifestyle = Math.max(0, spendingBase + recycleAdj + secondHandAdj);

        const total = transport + energy + diet + lifestyle;

        state.results = {
            total: parseFloat(total.toFixed(2)),
            transport: parseFloat(transport.toFixed(2)),
            energy: parseFloat(energy.toFixed(2)),
            diet: parseFloat(diet.toFixed(2)),
            lifestyle: parseFloat(lifestyle.toFixed(2))
        };
        localStorage.setItem('cw_results', JSON.stringify(state.results));
    }


    // ===== DASHBOARD RENDERING =====
    function showDashboard() {
        $('#dashboard-section').classList.remove('hidden');
        $('#actions-section').classList.remove('hidden');
        navigateToSection('dashboard');
        setTimeout(() => {
            renderTotalFootprint();
            renderDonutChart();
            renderCategoryBars();
            renderEquivalents();
            renderActions();
            renderBadges();
        }, 300);
    }

    function renderTotalFootprint() {
        const total = state.results.total;
        animateValue($('#total-footprint'), 0, total, 2000);

        const ratingEl = $('#total-rating');
        let ratingClass, ratingText;
        if (total < 4) { ratingClass = 'rating-great'; ratingText = '🌟 Excellent — Below global average!'; }
        else if (total < 8) { ratingClass = 'rating-good'; ratingText = '👍 Good — Below US average'; }
        else if (total < 14) { ratingClass = 'rating-average'; ratingText = '⚠️ Average — Room to improve'; }
        else { ratingClass = 'rating-high'; ratingText = '🔴 High — Significant reduction needed'; }
        
        // Secure textContent to prevent XSS
        ratingEl.innerHTML = '';
        const span = document.createElement('span');
        span.className = `rating-badge ${ratingClass}`;
        span.textContent = ratingText;
        ratingEl.appendChild(span);

        const position = Math.min((total / 14.7) * 100, 100);
        const marker = $('#comparison-you');
        setTimeout(() => {
            marker.style.left = `${position}%`;
            marker.style.transition = 'left 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 500);
    }

    function renderDonutChart() {
        const canvas = $('#donut-chart');
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 220 * dpr; canvas.height = 220 * dpr;
        ctx.scale(dpr, dpr);

        const r = state.results;
        const data = [
            { label: 'Transport', value: r.transport, color: '#06b6d4' },
            { label: 'Energy', value: r.energy, color: '#f59e0b' },
            { label: 'Diet', value: r.diet, color: '#10b981' },
            { label: 'Lifestyle', value: r.lifestyle, color: '#a78bfa' }
        ];

        let animProgress = 0; const animDuration = 1200; const startTime = performance.now();
        function drawFrame(now) {
            animProgress = Math.min((now - startTime) / animDuration, 1);
            const eased = 1 - Math.pow(1 - animProgress, 3);
            ctx.clearRect(0, 0, 220, 220);
            let currentAngle = -Math.PI / 2;
            
            data.forEach(seg => {
                const segAngle = (seg.value / r.total) * Math.PI * 2 * eased;
                if (segAngle < 0.01) return;
                const startA = currentAngle + 0.02; const endA = currentAngle + segAngle - 0.02;
                ctx.beginPath();
                ctx.arc(110, 110, 95, startA, endA);
                ctx.arc(110, 110, 60, endA, startA, true);
                ctx.closePath();
                ctx.fillStyle = seg.color; ctx.fill();
                currentAngle += segAngle;
            });
            if (animProgress < 1) requestAnimationFrame(drawFrame);
        }
        requestAnimationFrame(drawFrame);
        animateValue($('#donut-center-val'), 0, r.total, 1500);

        // Render legend securely
        const legendEl = $('#donut-legend');
        legendEl.innerHTML = '';
        data.forEach(d => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `<span class="legend-dot" style="background:${d.color}"></span><span>${d.label}: ${d.value}t</span>`;
            legendEl.appendChild(item);
        });
    }

    function renderCategoryBars() {
        const r = state.results;
        const categories = [
            { label: '🚗 Transport', value: r.transport, color: '#06b6d4' },
            { label: '⚡ Energy', value: r.energy, color: '#f59e0b' },
            { label: '🥗 Diet', value: r.diet, color: '#10b981' },
            { label: '🏠 Lifestyle', value: r.lifestyle, color: '#a78bfa' }
        ];
        const maxVal = Math.max(...categories.map(c => c.value), 1);
        const container = $('#category-bars');
        container.innerHTML = '';
        
        categories.forEach(cat => {
            const el = document.createElement('div');
            el.className = 'cat-bar-item';
            el.innerHTML = `
                <div class="cat-bar-header">
                    <span class="cat-bar-label">${cat.label}</span>
                    <span class="cat-bar-value">${cat.value} tons</span>
                </div>
                <div class="cat-bar-track">
                    <div class="cat-bar-fill" style="background:${cat.color}; width: 0;" data-width="${(cat.value / maxVal) * 100}%"></div>
                </div>`;
            container.appendChild(el);
        });
        setTimeout(() => container.querySelectorAll('.cat-bar-fill').forEach(bar => bar.style.width = bar.dataset.width), 200);
    }

    function renderEquivalents() {
        const total = state.results.total;
        animateValue($('#equiv-trees'), 0, Math.round(total / 0.022), 1200);
        $('#equiv-driving').textContent = Math.round(total / 0.000404).toLocaleString();
        animateValue($('#equiv-bulbs'), 0, Math.round(total / 0.0045), 1200);
        animateValue($('#equiv-flights'), 0, parseFloat((total / 0.99).toFixed(1)), 1200);
    }

    // ===== ACTIONS & GAMIFICATION =====
    function setupActionTabs() {
        $$('.action-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                $$('.action-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
                tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
                renderActions(tab.dataset.category);
            });
        });
    }

    function renderActions(category = 'all') {
        const container = $('#actions-list');
        const filtered = category === 'all' ? ACTIONS : ACTIONS.filter(a => a.category === category);
        container.innerHTML = '';

        filtered.forEach(action => {
            const isCompleted = state.completedActions.includes(action.id);
            const item = document.createElement('div');
            item.className = `action-item ${isCompleted ? 'completed' : ''}`;
            item.dataset.actionId = action.id;
            item.tabIndex = 0;
            item.setAttribute('role', 'listitem');
            
            item.innerHTML = `
                <div class="action-check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div class="action-info">
                    <div class="action-title">${action.title}</div>
                    <div class="action-desc">${action.desc}</div>
                </div>
                <div class="action-meta">
                    <span class="action-impact impact-${action.impact}">${action.impact} Impact</span>
                    <span class="action-points">+${action.points} pts</span>
                </div>
            `;
            
            item.addEventListener('click', () => toggleAction(action.id));
            item.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAction(action.id); }});
            container.appendChild(item);
        });
    }

    function toggleAction(actionId) {
        const idx = state.completedActions.indexOf(actionId);
        const action = ACTIONS.find(a => a.id === actionId);
        if (!action) return;
        if (idx > -1) { state.completedActions.splice(idx, 1); state.points -= action.points; }
        else { state.completedActions.push(actionId); state.points += action.points; }
        
        localStorage.setItem('cw_completedActions', JSON.stringify(state.completedActions));
        localStorage.setItem('cw_points', state.points.toString());
        
        const activeTab = $('.action-tab.active');
        renderActions(activeTab ? activeTab.dataset.category : 'all');
        renderBadges();
        updatePointsDisplay();
    }

    function updatePointsDisplay() {
        const pointsEl = $('#total-points');
        animateValue(pointsEl, parseInt(pointsEl.textContent, 10) || 0, state.points, 500);
        const level = Math.floor(state.points / 100) + 1;
        $('#user-level').textContent = level;
        $('#level-progress-fill').style.width = `${(state.points % 100)}%`;
    }

    function renderBadges() {
        const container = $('#badges-display');
        container.innerHTML = '';
        BADGES.forEach(badge => {
            let earned = (badge.threshold && state.completedActions.length >= badge.threshold) || 
                         (badge.thresholdPoints && state.points >= badge.thresholdPoints);
            const el = document.createElement('div');
            el.className = `badge-item ${earned ? 'earned' : 'locked'}`;
            el.innerHTML = `<span aria-hidden="true">${badge.icon}</span><span class="badge-tooltip">${badge.name}: ${badge.desc}</span>`;
            container.appendChild(el);
        });
        updatePointsDisplay();
    }


    // ===== AUTOMATED 100-CASE TEST SUITE =====
    function setupTestSuite() {
        const toggleBtn = $('#test-suite-toggle');
        const suiteSection = $('#test-suite-section');
        const runBtn = $('#run-tests-btn');
        
        toggleBtn.addEventListener('click', () => {
            suiteSection.classList.toggle('hidden');
            if(!suiteSection.classList.contains('hidden')) suiteSection.scrollIntoView({behavior: 'smooth'});
        });

        runBtn.addEventListener('click', () => runAllTests());
    }

    function runAllTests() {
        const tbody = $('#test-log-body');
        tbody.innerHTML = ''; // clear
        
        let passed = 0; let failed = 0;
        const totalTests = 100;
        
        // Save original state to restore later
        const originalInputs = JSON.parse(JSON.stringify(state.inputs));

        for(let i=1; i<=totalTests; i++) {
            // Generate random scenario
            const scenario = {
                vehicleType: ['gasoline', 'diesel', 'hybrid', 'electric', 'none'][i % 5],
                weeklyMiles: (i * 10) % 500,
                flightsPerYear: i % 10,
                publicTransit: ['no', 'sometimes', 'daily'][i % 3],
                electricityBill: (i * 25) % 400,
                heatingSource: ['natural-gas', 'electric', 'oil', 'renewable'][i % 4],
                homeSize: 500 + ((i * 100) % 4000),
                renewableEnergy: ['no', 'partial', 'yes'][i % 3],
                dietType: ['heavy-meat', 'average', 'low-meat', 'vegetarian', 'vegan'][i % 5],
                localFood: ['rarely', 'sometimes', 'mostly'][i % 3],
                foodWaste: ['a-lot', 'some', 'minimal'][i % 3],
                spendingHabits: ['minimal', 'moderate', 'high'][i % 3],
                recycling: ['no', 'recycle-only', 'both'][i % 3],
                secondHand: ['never', 'sometimes', 'often'][i % 3]
            };
            
            // Assign and calculate
            state.inputs = scenario;
            calculateFootprint();
            
            const r = state.results;
            
            // Assertions
            let isPass = true;
            let msg = '';
            
            if (r.total < 0 || r.transport < 0 || r.energy < 0 || r.diet < 0 || r.lifestyle < 0) {
                isPass = false; msg = 'Emissions cannot be negative.';
            }
            if (isNaN(r.total) || !isFinite(r.total)) {
                isPass = false; msg = 'Total is NaN or Infinite.';
            }
            if (r.total !== parseFloat((r.transport + r.energy + r.diet + r.lifestyle).toFixed(2))) {
                // Float precision check
                if (Math.abs(r.total - (r.transport + r.energy + r.diet + r.lifestyle)) > 0.05) {
                    isPass = false; msg = 'Total does not match sum of categories.';
                }
            }

            if(isPass) passed++; else failed++;

            // Render log row securely
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${i}</td>
                <td>Calculation</td>
                <td>V:${scenario.vehicleType}, M:${scenario.weeklyMiles}, Bill:$${scenario.electricityBill}</td>
                <td class="${isPass ? 'test-result-pass' : 'test-result-fail'}">${isPass ? 'PASS' : 'FAIL'}</td>
                <td>Total: ${r.total}t</td>
            `;
            tbody.appendChild(tr);
        }

        // Restore original state
        state.inputs = originalInputs;
        calculateFootprint();

        // Update Stats UI
        $('#test-pass-count').textContent = passed;
        $('#test-fail-count').textContent = failed;
        $('#test-total-count').textContent = totalTests;
    }


    document.addEventListener('DOMContentLoaded', init);

})();
