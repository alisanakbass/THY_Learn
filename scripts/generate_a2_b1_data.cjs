const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------
// GRAMMAR DATA (A2 & B1)
// ---------------------------------------------------------
const a2GrammarList = [
    {
        "id": "a2_grammar_01",
        "title": "Past Continuous Tense (Geçmişte Devam Eden Zaman)",
        "level": "A2",
        "description": "Geçmişte belirli bir zamanda veya başka bir olay olurken devam etmekte olan eylemleri anlatır.",
        "explanation": "**Yapı:** Subject + was/were + Verb-ing\n\n**Olumlu:** I was flying over the Alps. They were waiting at the gate.\n**Olumsuz:** She wasn't preparing the cabin. The mechanic wasn't checking the engines.\n**Soru:** Were you sleeping? Was the wind blowing strongly?\n\n**Havacılık Örnekleri:**\n- We were flying at 35,000 feet when the engine alarms started. (Motor alarmları başladığında uçuyorduk.)\n- The passengers were boarding while it was raining. (Yağmur yağarken yolcular uçağa biniyordu.)",
        "aviationContext": "Bir kaza araştırmasında veya bir durum geçmişte raporlanırken sık kullanılır: 'What were you doing when you heard the noise?'",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "The pilot ___ (sleep) in the crew rest area when the turbulence started.",
                "answer": "was sleeping",
                "options": ["slept", "was sleeping", "sleeps", "is sleeping"]
            },
            {
                "type": "fillBlank",
                "question": "___ the passengers ___ (watch) the safety video?",
                "answer": "Were...watching",
                "options": ["Was...watching", "Were...watching", "Did...watch", "Are...watching"]
            },
            {
                "type": "translate",
                "question": "Uçak fırtınanın içinden uçuyordu.",
                "answer": "The airplane was flying through the storm."
            },
            {
                "type": "correctError",
                "question": "I were talking to the tower.",
                "answer": "I was talking to the tower."
            }
        ]
    },
    {
        "id": "a2_grammar_02",
        "title": "Comparatives & Superlatives (Karşılaştırmalar ve En Üstünlük)",
        "level": "A2",
        "description": "Birden fazla nesneyi/durumu birbirleriyle kıyaslarken kullanılır.",
        "explanation": "**Kısa Sıfatlar:** +er / +est (fast - faster - fastest) -> The A380 is bigger than the 737.\n**Uzun Sıfatlar:** more / most (comfortable - more comfortable - most comfortable)\n**Düzensiz:** good -> better -> best, bad -> worse -> worst\n\n**Havacılık Örnekleri:**\n- The flight to London is longer than the flight to Athens. (Londra uçuşu Atina'dan daha uzundur.)\n- This was the worst turbulence I have experienced. (Bu yaşadığım en kötü türbülanstı.)\n- Flying is the safest way to travel. (Uçmak en güvenli seyahat yoludur.)",
        "aviationContext": "Uçak tiplerini, hava koşullarını veya rota seçeneklerini karşılaştırırken kullanılır.",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "The Boeing 777 is ___ (heavy) than the A320.",
                "answer": "heavier",
                "options": ["heavy", "more heavy", "heavier", "heaviest"]
            },
            {
                "type": "fillBlank",
                "question": "What is the ___ (good) airline in the world?",
                "answer": "best",
                "options": ["gooder", "better", "best", "most good"]
            },
            {
                "type": "translate",
                "question": "Bu havalimanı eskisinden daha büyük.",
                "answer": "This airport is bigger than the old one."
            },
            {
                "type": "correctError",
                "question": "This is the more difficult landing I did.",
                "answer": "This is the most difficult landing I did."
            }
        ]
    },
    {
        "id": "a2_grammar_03",
        "title": "Modals of Obligation (Zorunluluk - Must & Have to)",
        "level": "A2",
        "description": "Kuralları, zorunlulukları ve güçlü tavsiyeleri ifade eder.",
        "explanation": "**Must:** İçsel zorunluluklar veya güçlü emirler (I must rest before the flight / You must fasten seatbelts).\n**Have to:** Dış kurallar veya yasalar (Pilots have to pass medical exams).\n**Muntn't:** Yasak! (You mustn't smoke in the toilet).\n**Don't have to:** Zorunlu değil, serbest (You don't have to wear a jacket).\n\n**Havacılık Örnekleri:**\n- Cabin crew must close the doors. (Kapatmak zorundalar - kural.)\n- We don't have to change planes in Dubai. (Dubai'de aktarma yapmak zorunda değiliz.)",
        "aviationContext": "Güvenlik kuralları ve operasyon prosedürleri anlatılırken vazgeçilmezdir.",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "Passengers ___ smoke on the airplane. It is illegal.",
                "answer": "mustn't",
                "options": ["don't have to", "mustn't", "must", "haven't to"]
            },
            {
                "type": "fillBlank",
                "question": "Pilots ___ pass difficult tests.",
                "answer": "have to",
                "options": ["has to", "have to", "must to", "having to"]
            },
            {
                "type": "translate",
                "question": "Pasaportunu göstermek zorundasın.",
                "answer": "You have to show your passport."
            },
            {
                "type": "correctError",
                "question": "You don't must cross the runway.",
                "answer": "You mustn't cross the runway."
            }
        ]
    },
    {
        "id": "a2_grammar_04",
        "title": "Future Tenses (Gelecek Zaman - Will vs. Going to)",
        "level": "A2",
        "description": "Gelecek planları (going to) ile anlık kararlar veya tahminler (will) arasındaki farktır.",
        "explanation": "**Going To:** Önceden planlanmış niyetler (We are going to buy a new aircraft) veya kesin kanıtı olan olaylar (Look at those black clouds, it is going to rain).\n**Will:** Konuşma anındaki kararlar, tahminler veya söz vermeler (I will fly the next leg / We will arrive at 10 PM).\n\n**Havacılık Örnekleri:**\n- The flight will take 3 hours. (Tahmin)\n- We are going to land in 10 minutes. (Kuleye verilen kesin plan)\n- I will help you with your bag. (Anlık söz/teklif)",
        "aviationContext": "Yolcuları veya kuleyi bir sonraki hamle için bilgilendirmek amacıyla kullanılır.",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "I ___ (help) you find your seat.",
                "answer": "will help",
                "options": ["will help", "am going to help", "am helping", "help"]
            },
            {
                "type": "fillBlank",
                "question": "Look at the radar! We ___ (hit) a storm.",
                "answer": "are going to hit",
                "options": ["are going to hit", "will hit", "hit", "hitting"]
            },
            {
                "type": "translate",
                "question": "Ne zaman iniş yapacağız?",
                "answer": "When are we going to land?"
            },
            {
                "type": "correctError",
                "question": "I am opening the door for you.",
                "answer": "I will open the door for you."
            }
        ]
    }
];

const b1GrammarList = [
    {
        "id": "b1_grammar_01",
        "title": "Present Perfect Tense (Yakın Geçmiş / Etkileri Süren)",
        "level": "B1",
        "description": "Geçmişte başlayıp etkisi veya süreci şu an devam eden olaylar (just/already/yet/since/for).",
        "explanation": "**Yapı:** Subject + have/has + V3 (Past Participle)\n\n**Olumlu:** I have (I've) flown this route before. (Bu rotayı daha önce uçtum - tecrübe)\n**Olumsuz:** They haven't boarded yet. (Henüz uçağa binmediler)\n**Soru:** Have you ever seen a storm like this? (Hiç böyle fırtına gördün mü?)\n\n**Havacılık Örnekleri:**\n- We have just landed. (Az önce indik.)\n- The captain has worked here for 10 years. (Kaptan 10 yıldır burada çalışıyor.)\n- Have they loaded the luggage yet? (Bagajı yüklediler mi?)",
        "aviationContext": "Deneyimlerden, 'az önce' olanlardan veya tamamlanması beklenen görevlerin raporlanmasında esastır (ATC'ye: 'We have reached flight level 350').",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "___ you ever ___ (fly) over the Atlantic?",
                "answer": "Have...flown",
                "options": ["Have...fly", "Have...flown", "Did...fly", "Are...flying"]
            },
            {
                "type": "fillBlank",
                "question": "The mechanic ___ (just/finish) the checks.",
                "answer": "has just finished",
                "options": ["just finished", "has just finished", "have just finished", "is just finished"]
            },
            {
                "type": "translate",
                "question": "Henüz kalkış izni almadık.",
                "answer": "We haven't received clearance yet."
            },
            {
                "type": "correctError",
                "question": "They didn't arrive yet.",
                "answer": "They haven't arrived yet."
            }
        ]
    },
    {
        "id": "b1_grammar_02",
        "title": "First and Second Conditionals (Eğer / Şart Cümleleri: Type 1 & 2)",
        "level": "B1",
        "description": "Gerçekleşme ihtimali olan (Type 1) veya varsayımsal/hayali (Type 2) olaylar.",
        "explanation": "**Type 1 (Gerçek Olasılıklar):** If + Present Simple, ... will + V1\n- If the weather is bad, the flight will be delayed. (Eğer hava kötüyse...)\n\n**Type 2 (Varsayım / Hayali Durumlar):** If + Past Simple, ... would + V1\n- If I were the captain, I would divert the plane. (Ben kaptan olsaydım, uçağı yönlendirirdim - ama değilim)\n\n**Havacılık Örnekleri:**\n- If the engine fails, the pilot will follow emergency protocols.\n- If we had more fuel, we wouldn't need to land in Rome.",
        "aviationContext": "Risk değerlendirmesinde ve simülasyon eğitimlerinde (What if senaryolarında) şart cümleleri sürekli konuşulur.",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "If you push that button, the alarm ___ (sound).",
                "answer": "will sound",
                "options": ["sounded", "sounds", "will sound", "would sound"]
            },
            {
                "type": "fillBlank",
                "question": "If we ___ (have) fewer passengers, the plane would be lighter.",
                "answer": "had",
                "options": ["have", "had", "will have", "have had"]
            },
            {
                "type": "translate",
                "question": "Rüzgar durursa kalkış yapacağız.",
                "answer": "If the wind stops, we will take off."
            },
            {
                "type": "correctError",
                "question": "If the fog cleared, we will depart.",
                "answer": "If the fog clears, we will depart."
            }
        ]
    },
    {
        "id": "b1_grammar_03",
        "title": "Passive Voice (Edilgen Yapı)",
        "level": "B1",
        "description": "Eylemin kimin tarafından yapıldığından ziyade yapılan işe odaklanmak istendiğinde kullanılır.",
        "explanation": "**Yapı:** (Obj) + be + V3 (Past Participle)\n\n**Geniş Zaman:** The aircraft is checked daily. (Uçak her gün kontrol edilir.)\n**Geçmiş Zaman:** The flight was canceled yesterday. (Uçuş dün iptal edildi.)\n**Gelecek Zaman:** Breakfast will be served shortly. (Kahvaltı birazdan servis edilecek.)\n\n**Havacılık Örnekleri:**\n- The runway is cleared for you. (Pist sizin için temizlendi/boşaltıldı.)\n- Passengers are required to remain seated. (Yolcuların oturması gerekmektedir.)",
        "aviationContext": "Resmi kule mesajlarında ve kabin duyurularında kişisel olmamak için edilgen çatı kullanılır.",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "The doors ___ (close) 10 minutes ago.",
                "answer": "were closed",
                "options": ["are closed", "closed", "were closed", "was closed"]
            },
            {
                "type": "fillBlank",
                "question": "All tickets ___ (sell) online now.",
                "answer": "are sold",
                "options": ["sell", "are selling", "are sold", "is sold"]
            },
            {
                "type": "translate",
                "question": "Bu uçak Amerika'da yapıldı.",
                "answer": "This airplane was made in America."
            },
            {
                "type": "correctError",
                "question": "The engine repaired yesterday.",
                "answer": "The engine was repaired yesterday."
            }
        ]
    }
];

// Write grammar files
fs.writeFileSync('public/data/grammar/a2-lessons.json', JSON.stringify(a2GrammarList, null, 2), 'utf-8');
fs.writeFileSync('public/data/grammar/b1-lessons.json', JSON.stringify(b1GrammarList, null, 2), 'utf-8');

// ---------------------------------------------------------
// READING DATA (A2 & B1)
// ---------------------------------------------------------
const a2ReadingList = [
    {
        "id": "a2_read_01",
        "title": "Dealing with Bad Weather",
        "level": "A2",
        "category": "aviation",
        "text": "Every pilot knows that weather is very important for flying. Yesterday, Captain Taylor was flying a big jet from New York to London. Everything was fine until they reached the middle of the Atlantic Ocean.\n\nSuddenly, the radar screen showed a heavy storm ahead. The clouds were completely black, and there was lightning everywhere. Captain Taylor had to make a quick decision. He contacted the Air Traffic Control (ATC) immediately. 'We have a strong thunderstorm ahead of us. We are requesting permission to deviate left by 15 miles,' he said. \n\nThe ATC allowed the change. The passengers felt some bumps, but because of the captain's safe choice, nobody was hurt. When they landed in London, many passengers thanked the crew.",
        "textTr": "Her pilot hava durumunun uçuş için çok önemli olduğunu bilir. Dün, Kaptan Taylor New York'tan Londra'ya büyük bir jet uçuruyordu. Atlantik Okyanusu'nun ortasına ulaşana kadar her şey yolundaydı.\n\nAniden radar ekranı ileride ağır bir fırtına gösterdi. Bulutlar tamamen siyahtı ve her yerde şimşekler vardı. Kaptan Taylor hızlı bir karar vermek zorundaydı. Derhal Hava Trafik Kontrolü ile (ATC) iletişime geçti. 'Önümüzde güçlü bir fırtına/gök gürültülü sağanak var. 15 mil sola sapmak (rotadan çıkmak) için izin istiyoruz' dedi.\n\nATC değişikliğe izin verdi. Yolcular birkaç sarsıntı hissettiler ama kaptanın güvenli seçimi sayesinde kimse yaralanmadı. Londra'ya indiklerinde, birçok yolcu mürettebata teşekkür etti.",
        "questions": [
            { "question": "Where was the flight going to?", "options": ["New York", "London", "The Atlantic Ocean", "Paris"], "answer": 1 },
            { "question": "What did the radar show?", "options": ["Another airplane", "A black hole", "A heavy storm", "Clear skies"], "answer": 2 },
            { "question": "What did the captain request from ATC?", "options": ["More fuel", "To return to New York", "To deviate left by 15 miles", "To climb higher"], "answer": 2 },
            { "question": "Were the passengers hurt during the turbulence?", "options": ["Yes, they were", "No, nobody was hurt", "Some of them were hurt", "It doesn't say"], "answer": 1 }
        ],
        "vocabulary": ["thunderstorm", "deviate", "decision", "bumps", "lightning"]
    },
    {
        "id": "a2_read_02",
        "title": "A Day in the Life of a Mechanic",
        "level": "A2",
        "category": "technical",
        "text": "Aircraft mechanics are the hidden heroes of aviation. They perform daily tasks to ensure that thousands of people travel safely. Dave is one of these mechanics. Early in the morning, Dave starts his shift by checking the maintenance logs of a Boeing 737. \n\nHe usually checks the tires, brakes, and the exterior of the aircraft first. A tire must be changed if there is any serious tear or low pressure. 'We can't take risks with a 60-ton machine,' Dave usually says.\n\nThen he opens the engine cowlings. He carefully looks for oil leaks or damaged parts. If he finds a problem, the aircraft cannot fly until it is solved. Sometimes a flight is delayed because of a technical problem, but safety always comes first.",
        "textTr": "Uçak mekanikerleri havacılığın gizli kahramanlarıdır. Binlerce insanın güvenle seyahat etmesi için günlük görevler yaparlar. Dave bu teknisyenlerden biri. Sabah erkenden, Dave mesaisine bir Boeing 737'nin bakım kayıt defterlerini kontrol ederek başlar.\n\nGenellikle önce lastikleri, frenleri ve uçağın dışını kontrol eder. Eğer ciddi bir yırtık (aşınma) ya da düşük basınç varsa lastik değiştirilmek zorundadır. Dave genelde '60 tonluk bir makineyle risk alamayız' der.\n\nSonra motor kaportalarını (kapaklarını) açar. Dikkatli bir şekilde yağ kaçakları veya hasarlı parçalar arar. Eğer bir sorun bulursa, sorun çözülene kadar uçak uçamaz. Bazen teknik bir nedenden dolayı uçuş rötara girer ancak güvenlik her zaman ilk sıradadır.",
        "questions": [
            { "question": "What do aircraft mechanics do?", "options": ["They fly the airplane", "They ensure people travel safely", "They sell tickets", "They cook flight food"], "answer": 1 },
            { "question": "What does Dave check first?", "options": ["The seats", "The engines", "Tires, brakes, and exterior", "Maintenance logs"], "answer": 3 },
            { "question": "Why is a flight sometimes delayed?", "options": ["Because passengers are late", "Because of a technical problem", "Because Dave is sleeping", "Because there is no fuel"], "answer": 1 },
            { "question": "What must be changed if there is low pressure?", "options": ["The pilot", "The engine", "The tire", "The brakes"], "answer": 2 }
        ],
        "vocabulary": ["mechanic", "maintenance", "exterior", "tear", "leaks"]
    }
];

const b1ReadingList = [
    {
        "id": "b1_read_01",
        "title": "Emergency Landing in the Hudson River",
        "level": "B1",
        "category": "aviation",
        "text": "On January 15, 2009, US Airways Flight 1549 took off from New York's LaGuardia Airport. Almost immediately after takeoff, a flock of Canada geese struck both engines of the Airbus A320. The collision caused a complete loss of engine power. \n\nCaptain Chesley 'Sully' Sullenberger and First Officer Jeffrey Skiles realized they couldn't reach any nearby airports. With only seconds to react, Captain Sully made a historic decision: he would ditch (land in water) the aircraft into the icy Hudson River.\n\nThanks to the pilots' remarkable skills and teamwork, the aircraft glided smoothly into the water. Incredibly, all 155 passengers and crew members survived. Ferry boats and rescue teams arrived quickly to pull people from the wings of the floating jet. This event later became known as the 'Miracle on the Hudson'.",
        "textTr": "15 Ocak 2009'da US Airways'in 1549 sefer sayılı uçuşu New York'taki LaGuardia Havalimanı'ndan kalktı. Kalkıştan neredeyse hemen sonra, bir Kanada kazı sürüsü Airbus A320'nin her iki motoruna da çarptı (girdi). Çarpışma, motor gücünün tamamen kaybedilmesine yol açtı.\n\nKaptan Chesley 'Sully' Sullenberger ve İkinci Kaptan Jeffrey Skiles yakındaki herhangi bir havalimanına ulaşamayacaklarını fark ettiler. Tepki vermek için sadece saniyeleri olan Kaptan Sully, tarihi bir karar verdi: uçağı buz gibi Hudson Nehri'ne acil iniş yaptıracaktı.\n\nPilotların dikkate değer becerileri ve ekip çalışması sayesinde uçak pürüzsüzce suya süzüldü (planör gibi indi). İnanılmaz bir şekilde, uçaktaki 155 yolcu ve mürettebatın hepsi hayatta kaldı. Feribotlar ve kurtarma ekipleri, insanları yüzen jetin kanatlarından çekip almak için hızla olay yerine vardı. Bu olay daha sonra 'Hudson Mucizesi' olarak bilinir oldu.",
        "questions": [
            { "question": "What caused the engine failure?", "options": ["A storm", "A flock of birds", "A mechanical error", "Lack of fuel"], "answer": 1 },
            { "question": "When did the engines lose power?", "options": ["Before landing", "In the parking area", "Immediately after takeoff", "In the ocean"], "answer": 2 },
            { "question": "Where did the captain decide to land?", "options": ["Back at LaGuardia", "New Jersey Airport", "On a highway", "In the Hudson River"], "answer": 3 },
            { "question": "How many people died in the accident?", "options": ["155", "5", "None, they all survived", "Half of the passengers"], "answer": 2 },
            { "question": "What is 'ditching'?", "options": ["Dropping luggage", "Turning the airplane", "Landing in water", "Opening the doors"], "answer": 2 }
        ],
        "vocabulary": ["flock", "collision", "ditch", "glided", "survive"]
    }
];

// Write reading files
fs.writeFileSync('public/data/reading/a2-passages.json', JSON.stringify(a2ReadingList, null, 2), 'utf-8');
fs.writeFileSync('public/data/reading/b1-passages.json', JSON.stringify(b1ReadingList, null, 2), 'utf-8');

// ---------------------------------------------------------
// LISTENING DATA (A2 & B1)
// ---------------------------------------------------------
const a2ListeningList = [
    {
        "id": "a2_listen_01",
        "title": "Check-in Desk Conversation",
        "level": "A2",
        "type": "conversation",
        "text": "A: Good morning. Can I have your passport and ticket, please?\nB: Here you are.\nA: Thank you. Are you checking in any bags today?\nB: Yes, just one suitcase. The other one is a carry-on.\nA: Okay, place it on the scale, please. Oh, it's 25 kilos. It is a bit heavy, but it is acceptable. Would you prefer a window or an aisle seat?\nB: An aisle seat, please. It is more comfortable for my long legs.",
        "textTr": "A: Günaydın. Pasaportunuzu ve biletinizi alabilir miyim lütfen?\nB: Buyurun.\nA: Teşekkürler. Bugün bagaj verecek misiniz?\nB: Evet, sadece bir büyük bavul. Diğeriyse el bagajı (kabin boy).\nA: Tamam, lütfen tartıya koyun. Oh, 25 kilo. Biraz ağır ama kabul edilebilir. Pencere kenarı mı yoksa koridor koltuğu mu tercih edersiniz?\nB: Koridor koltuğu lütfen. Benim uzun bacaklarım için daha rahat.",
        "questions": [
            { "question": "How many bags is the passenger checking in (giving to the plane's hold)?", "options": ["None", "One", "Two", "Three"], "answer": 1 },
            { "question": "How heavy is the suitcase?", "options": ["15 kilos", "20 kilos", "25 kilos", "30 kilos"], "answer": 2 },
            { "question": "Why does the passenger want an aisle seat?", "options": ["To look outside", "To sleep better", "For his long legs", "To speak to the crew"], "answer": 2 }
        ],
        "fillBlanks": [
            { "text": "Are you checking in any ___ today?", "answer": "bags" },
            { "text": "The other one is a ___.", "answer": "carry-on" },
            { "text": "Place it on the ___, please.", "answer": "scale" }
        ]
    },
    {
        "id": "a2_listen_02",
        "title": "Requesting Altitude Change",
        "level": "A2",
        "type": "atc",
        "text": "Pilot: Frankfurt Control, this is Turkish One Niner. We are experiencing moderate turbulence at Flight Level 320. Requesting climb to Flight Level 340.\nATC: Turkish One Niner, climb and maintain Flight Level 340. \nPilot: Climbing to Flight Level 340, Turkish One Niner.",
        "textTr": "Pilot: Frankfurt Kontrol, burası Turkish 19 (One Niner). Uçuş Seviyesi 320'de (32.000 feet) orta şiddetli türbülans yaşıyoruz. Uçuş Seviyesi 340'a tırmanış talep ediyoruz.\nATC: Turkish 19, Uçuş Seviyesi 340'a tırmanın ve muhafaza edin.\nPilot: Uçuş Seviyesi 340'a tırmanıyorum, Turkish 19.",
        "questions": [
            { "question": "Why does the pilot want to change altitude?", "options": ["Because of bad view", "Because of moderate turbulence", "To save fuel", "Because of engine failure"], "answer": 1 },
            { "question": "What is the new requested altitude?", "options": ["Flight Level 300", "Flight Level 320", "Flight Level 340", "Flight Level 360"], "answer": 2 }
        ],
        "fillBlanks": [
            { "text": "We are experiencing moderate ___.", "answer": "turbulence" },
            { "text": "___ climb to Flight Level 340.", "answer": "Requesting" },
            { "text": "Climb and ___ Flight Level 340.", "answer": "maintain" }
        ]
    }
];

const b1ListeningList = [
    {
        "id": "b1_listen_01",
        "title": "Emergency Declaration (Mayday)",
        "level": "B1",
        "type": "emergency",
        "text": "MAYDAY, MAYDAY, MAYDAY. Heathrow Tower, Speedbird Five Two. We have lost power in engine number two. We are declaring an emergency and requesting immediate vector for an emergency landing. Passengers count 180, fuel remaining 4 hours.",
        "textTr": "MAYDAY, MAYDAY, MAYDAY. (İmdat çağrısı) Heathrow Kule, British Airways 52. İki numaralı motorda güç kaybettik. Acil durum ilan ediyoruz ve acil iniş için derhal yönlendirme (vektör) talep ediyoruz. Yolcu sayısı 180, kalan yakıt 4 saat.",
        "questions": [
            { "question": "What is the nature of the emergency?", "options": ["Engine fire", "Cabin depressurization", "Lost power in an engine", "Hijacking"], "answer": 2 },
            { "question": "What does the pilot request?", "options": ["Medical assistance", "Immediate vector for landing", "To dump fuel", "More coffee"], "answer": 1 },
            { "question": "How many passengers are on board?", "options": ["4", "52", "180", "200"], "answer": 2 }
        ],
        "fillBlanks": [
            { "text": "We have lost power in ___ number two.", "answer": "engine" },
            { "text": "We are declaring an ___.", "answer": "emergency" },
            { "text": "Requesting immediate ___ for landing.", "answer": "vector" }
        ]
    }
];

// Write listening files
fs.writeFileSync('public/data/listening/a2-exercises.json', JSON.stringify(a2ListeningList, null, 2), 'utf-8');
fs.writeFileSync('public/data/listening/b1-exercises.json', JSON.stringify(b1ListeningList, null, 2), 'utf-8');

// ---------------------------------------------------------
// VOCABULARY DATA (A2 & B1) -> Only Aviation Focus
// ---------------------------------------------------------

const a2VocabList = [
    { "id": "a2_av_001", "en": "turbulence", "tr": "türbülans/çalkantı", "example": "We hit some turbulence over the mountains.", "exampleTr": "Dağların üzerinde türbülansa girdik.", "pronunciation": "/ˈtɜːrbjələns/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_002", "en": "customs", "tr": "gümrük", "example": "You must declare these goods at customs.", "exampleTr": "Bu malları gümrükte bildirmek zorundasınız.", "pronunciation": "/ˈkʌstəmz/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_003", "en": "aisle", "tr": "koridor", "example": "I prefer the aisle seat so I can stretch my legs.", "exampleTr": "Bacaklarımı uzatabildiğim için koridor koltuğunu tercih ederim.", "pronunciation": "/aɪl/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_004", "en": "boarding", "tr": "biniş", "example": "Boarding will start in 10 minutes.", "exampleTr": "Uçağa biniş 10 dakika içinde başlayacak.", "pronunciation": "/ˈbɔːrdɪŋ/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_005", "en": "departure", "tr": "kalkış/ayrılış", "example": "Check the departure screen for our gate.", "exampleTr": "Kapımız için kalkış ekranını kontrol et.", "pronunciation": "/dɪˈpɑːrtʃər/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_006", "en": "arrival", "tr": "varış/geliş", "example": "Our estimated time of arrival is 4 PM.", "exampleTr": "Tahmini varış saatimiz öğleden sonra 4.", "pronunciation": "/əˈraɪvəl/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_007", "en": "delay", "tr": "rötar/gecikme", "example": "The flight has a two hour delay.", "exampleTr": "Uçuşun 2 saat rötari var.", "pronunciation": "/dɪˈleɪ/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_008", "en": "altitude", "tr": "irtifa", "example": "We are maintaining an altitude of 30,000 feet.", "exampleTr": "30,000 ft irtifayı koruyoruz.", "pronunciation": "/ˈæltɪtuːd/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_009", "en": "maintenance", "tr": "bakım", "example": "The aircraft is undergoing routine maintenance.", "exampleTr": "Uçak periyodik bakımdan geçiyor.", "pronunciation": "/ˈmeɪntənəns/", "category": "aviation", "level": "A2" },
    { "id": "a2_av_010", "en": "carousel", "tr": "bagaj bandı", "example": "Your bags will arrive at carousel number 4.", "exampleTr": "Bavullarınız 4 numaralı bagaj bandına gelecek.", "pronunciation": "/ˌkærəˈsel/", "category": "aviation", "level": "A2" }
];

const b1VocabList = [
    { "id": "b1_av_001", "en": "fuselage", "tr": "uçak gövdesi", "example": "The fuselage was painted with the airline's new colors.", "exampleTr": "Uçak gövdesi havayolunun yeni renkleriyle boyandı.", "pronunciation": "/ˈfjuːzəlɑːʒ/", "category": "technical", "level": "B1" },
    { "id": "b1_av_002", "en": "clearance", "tr": "müsaade/izin", "example": "We are waiting for ATC clearance to start engines.", "exampleTr": "Kule'den motorıştırma izni (müsaadesi) bekliyoruz.", "pronunciation": "/ˈklɪrəns/", "category": "technical", "level": "B1" },
    { "id": "b1_av_003", "en": "visibility", "tr": "görüş mesafesi", "example": "Visibility is down to 100 meters due to heavy fog.", "exampleTr": "Yoğun sis yüzünden görüş mesafesi 100 metreye düştü.", "pronunciation": "/ˌvɪzɪˈbɪlɪti/", "category": "weather", "level": "B1" },
    { "id": "b1_av_004", "en": "ditch", "tr": "suya iniş yapmak (kaza)", "example": "The pilot was forced to ditch the plane in the ocean.", "exampleTr": "Pilot uçağı okyanusa indirmeye/çakmaya zorlandı.", "pronunciation": "/dɪtʃ/", "category": "technical", "level": "B1" },
    { "id": "b1_av_005", "en": "taxi", "tr": "taksi (uçağın yerde yürümesi)", "example": "The airplane will taxi to runway 9L.", "exampleTr": "Uçak 9L pistine kadar yerde ilerleyecek.", "pronunciation": "/ˈtæksi/", "category": "aviation", "level": "B1" },
    { "id": "b1_av_006", "en": "apron", "tr": "apron (park alanı)", "example": "The bus will take passengers to the apron.", "exampleTr": "Otobüs yolcuları aprona kadar götürecek.", "pronunciation": "/ˈeɪprən/", "category": "aviation", "level": "B1" },
    { "id": "b1_av_007", "en": "mayday", "tr": "acı durum / imdat", "example": "The captain declared a mayday due to dual engine failure.", "exampleTr": "Kaptan iki motorun susması yüzünden mayday ilan etti.", "pronunciation": "/ˈmeɪdeɪ/", "category": "aviation", "level": "B1" },
    { "id": "b1_av_008", "en": "tail", "tr": "kuyruk", "example": "There is a logo on the vertical tail.", "exampleTr": "Dikey kuyruğun üzerinde bir amblem var.", "pronunciation": "/teɪl/", "category": "technical", "level": "B1" },
    { "id": "b1_av_009", "en": "evacuation", "tr": "tahliye", "example": "The emergency evacuation took only 90 seconds.", "exampleTr": "Acil durum tahliyesi sadece 90 saniye sürdü.", "pronunciation": "/ɪˌvækjuˈeɪʃən/", "category": "technical", "level": "B1" },
    { "id": "b1_av_010", "en": "velocity", "tr": "hız/sürat", "example": "Wind velocity is increasing rapidly.", "exampleTr": "Rüzgar sürati hızla artıyor.", "pronunciation": "/vəˈlɑːsɪti/", "category": "weather", "level": "B1" }
];

// Write vocab files
fs.writeFileSync('public/data/vocabulary/a2-aviation.json', JSON.stringify(a2VocabList, null, 2), 'utf-8');
fs.writeFileSync('public/data/vocabulary/b1-aviation.json', JSON.stringify(b1VocabList, null, 2), 'utf-8');

console.log("A2 and B1 lesson data generated successfully in respective folders!");
