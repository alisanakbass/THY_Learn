const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------
// GRAMMAR DATA (a1-lessons.json) - Adding 5 more lessons (Total 10)
// ---------------------------------------------------------
const grammarExt = [
    {
        "id": "a1_grammar_06",
        "title": "Simple Past Tense (Geçmiş Zaman) - To Be",
        "level": "A1",
        "description": "Geçmişteki durumları ve yerleri belirtmek için 'was/were' kullanılır.",
        "explanation": "**Yapı:** Subject + was/were + Noun/Adjective\n\n**Olumlu:** I/He/She/It was at the airport. You/We/They were ready.\n**Olumsuz:** The weather wasn't (was not) good. The passengers weren't (were not) late.\n**Soru:** Were you a pilot? Was the flight on time?\n\n**Havacılık Örnekleri:**\n- Yesterday, the weather was very bad. (Dün hava çok kötüydü)\n- The airplane was on the runway 10 minutes ago. (Uçak 10 dakika önce pistteydi)",
        "aviationContext": "Brifinglerde veya uçuş kontrol raporlarında geçmiş durumlardan bahsederken kullanılır: 'The wind was strong.'",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "The weather ___ bad yesterday.",
                "answer": "was",
                "options": ["was", "were", "is", "are"]
            },
            {
                "type": "fillBlank",
                "question": "The passengers ___ happy with the flight.",
                "answer": "were",
                "options": ["was", "were", "wasn't", "is"]
            },
            {
                "type": "translate",
                "question": "Kaptan dün kokpitte değildi.",
                "answer": "The captain wasn't in the cockpit yesterday."
            },
            {
                "type": "correctError",
                "question": "We was at the gate.",
                "answer": "We were at the gate."
            }
        ]
    },
    {
        "id": "a1_grammar_07",
        "title": "Simple Past Tense (Geçmiş Zaman) - Regular & Irregular Verbs",
        "level": "A1",
        "description": "Geçmişte tamamlanmış eylemleri ifade eder.",
        "explanation": "**Düzenli Fiiller (Regular):** Fiil + ed (worked, arrived, pushed)\n**Düzensiz Fiiller (Irregular):** Kökten değişir (go -> went, fly -> flew, see -> saw)\n\n**Olumsuz (Negative):** Subject + didn't + Verb(yalın) (I didn't fly.)\n**Soru (Question):** Did + Subject + Verb(yalın)? (Did you take off?)\n\n**Havacılık Örnekleri:**\n- The plane landed 5 minutes ago. (Uçak 5 dakika önce indi)\n- We flew from Istanbul to London. (İstanbul'dan Londra'ya uçtuk)",
        "aviationContext": "Uçuş loglarında veya kule iletişiminde geçmiş manevralar için çok önemlidir: 'We climbed to 30,000 feet.'",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "The airplane ___ (land) safely an hour ago.",
                "answer": "landed",
                "options": ["land", "landed", "lands", "landing"]
            },
            {
                "type": "fillBlank",
                "question": "We ___ (fly) to Paris last week.",
                "answer": "flew",
                "options": ["flyed", "flew", "flies", "flied"]
            },
            {
                "type": "translate",
                "question": "Dün uçuş yapmadık.",
                "answer": "We didn't fly yesterday."
            },
            {
                "type": "correctError",
                "question": "Did the pilot checked the engines?",
                "answer": "Did the pilot check the engines?"
            }
        ]
    },
    {
        "id": "a1_grammar_08",
        "title": "Can / Can't (Yetenek ve İzin)",
        "level": "A1",
        "description": "Bir şeyi yapabilme yeteneğini, güncel ihtimali veya izin durumlarını belirtir.",
        "explanation": "**Olumlu:** I can fly this plane. (Bu uçağı uçurabilirim)\n**Olumsuz:** We can't (cannot) take off in this weather. (Bu havada kalkış yapamayız)\n**Soru:** Can you see the runway? (Pisti görebiliyor musun?)\n\n**Havacılık Örnekleri:**\n- Can I have your passport, please? (Pasaportunuzu alabilir miyim?)\n- Passengers can't use their phones during takeoff. (Yolcular kalkış sırasında telefonlarını kullanamazlar.)",
        "aviationContext": "İzin isterken veya ATC'ye bir durumu doğrularken sıkça kullanılır: 'Tower, we cannot see the runway/traffic.'",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "___ you hear me, tower?",
                "answer": "Can",
                "options": ["Do", "Are", "Can", "Is"]
            },
            {
                "type": "fillBlank",
                "question": "We ___ see the runway because of the fog.",
                "answer": "can't",
                "options": ["can't", "don't", "aren't", "doesn't"]
            },
            {
                "type": "translate",
                "question": "Şimdi kalkış yapabiliriz.",
                "answer": "We can take off now."
            },
            {
                "type": "correctError",
                "question": "He can to fly a helicopter.",
                "answer": "He can fly a helicopter."
            }
        ]
    },
    {
        "id": "a1_grammar_09",
        "title": "Has / Have Got (Sahiplik)",
        "level": "A1",
        "description": "Bir şeye sahip olmayı (var/yok) belirtmek için kullanılır.",
        "explanation": "**Yapı:** I/You/We/They have got (I've got) | He/She/It has got (He's got)\n**Olumsuz:** haven't got / hasn't got\n**Soru:** Have you got...? / Has he got...?\n\n**Havacılık Örnekleri:**\n- We have got enough fuel for the trip. (Seyahat için yeterli yakıtımız var.)\n- Has she got a boarding pass? (Onun biniş kartı var mı?)",
        "aviationContext": "Yolcu durumları, evrak kontrolü veya uçak donanımından bahsederken kullanılır: 'We have got a problem with the left engine.'",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "The captain ___ a map of the route.",
                "answer": "has got",
                "options": ["have got", "has got", "is", "are"]
            },
            {
                "type": "fillBlank",
                "question": "___ we ___ enough time before boarding?",
                "answer": "Have...got",
                "options": ["Have...got", "Has...got", "Do...got", "Are...got"]
            },
            {
                "type": "translate",
                "question": "Benim pasaportum var.",
                "answer": "I have got my passport."
            },
            {
                "type": "correctError",
                "question": "They hasn't got their luggage.",
                "answer": "They haven't got their luggage."
            }
        ]
    },
    {
        "id": "a1_grammar_10",
        "title": "There is / There are (Var/Yok)",
        "level": "A1",
        "description": "Bir nesnenin veya kişinin bir yerde mevcut olduğunu belirtir.",
        "explanation": "**Tekiller/Sayılamayanlar için:** There is (There's) a storm ahead.\n**Çoğullar için:** There are 150 passengers on board.\n**Olumsuz:** There isn't a problem. / There aren't many clouds.\n**Soru:** Is there a doctor on board? / Are there any questions?\n\n**Havacılık Örnekleri:**\n- There is heavy traffic at the airport. (Havalimanında yoğun trafik var)\n- There are two pilots in the cockpit. (Kokpitte iki pilot var)",
        "aviationContext": "Uçak içi veya dışındaki durumları yolculara veya kuleye bildirirken kullanılır: 'There is some turbulence ahead.'",
        "exercises": [
            {
                "type": "fillBlank",
                "question": "___ a delay on our flight.",
                "answer": "There is",
                "options": ["There is", "There are", "It is", "They are"]
            },
            {
                "type": "fillBlank",
                "question": "___ 3 exits on this aircraft.",
                "answer": "There are",
                "options": ["There is", "There are", "Is there", "Are there"]
            },
            {
                "type": "translate",
                "question": "Uçakta bir doktor var mı?",
                "answer": "Is there a doctor on the plane?"
            },
            {
                "type": "correctError",
                "question": "There is two engines on the Boeing 737.",
                "answer": "There are two engines on the Boeing 737."
            }
        ]
    }
];

// ---------------------------------------------------------
// READING DATA (a1-passages.json) - Adding 5 more reading passages
// ---------------------------------------------------------
const readingExt = [
    {
        "id": "a1_read_03",
        "title": "A Message from the Pilot",
        "level": "A1",
        "category": "aviation",
        "text": "Hello passengers. My name is Captain Mehmet. Welcome to our flight to London.\n\nThe weather in London today is rainy and cold. The temperature is 12 degrees. Our flight time is 4 hours. We are flying at 35,000 feet. The flight attendants are here to help you. They have food and drinks. \n\nPlease wear your seatbelts when you sit. Enjoy your flight and thank you for choosing our airline.",
        "textTr": "Merhaba yolcular. Adım Kaptan Mehmet. Londra uçuşumuza hoş geldiniz.\n\nBugün Londra'da hava yağmurlu ve soğuk. Sıcaklık 12 derece. Uçuş süremiz 4 saat. 35.000 feet (yaklaşık 10 km) yükseklikte uçuyoruz. Kabin görevlileri size yardım etmek için buradalar. Yemekleri ve içecekleri var.\n\nLütfen otururken emniyet kemerlerinizi takın. Uçuşunuzun keyfini çıkarın ve havayolumuzu seçtiğiniz için teşekkür ederiz.",
        "questions": [
            { "question": "What is the captain's name?", "options": ["Ali", "Ahmet", "Mehmet", "Mustafa"], "answer": 2 },
            { "question": "Where is the airplane flying to?", "options": ["Istanbul", "Paris", "London", "Berlin"], "answer": 2 },
            { "question": "What is the weather like in London?", "options": ["Sunny", "Rainy and cold", "Hot", "Snowy"], "answer": 1 },
            { "question": "How long is the flight?", "options": ["2 hours", "3 hours", "4 hours", "5 hours"], "answer": 2 },
            { "question": "What should passengers wear when they sit?", "options": ["Hats", "Jackets", "Glasses", "Seatbelts"], "answer": 3 }
        ],
        "vocabulary": ["passengers", "welcome", "flight time", "temperature", "seatbelts"]
    },
    {
        "id": "a1_read_04",
        "title": "My Favorite Airport",
        "level": "A1",
        "category": "general",
        "text": "My favorite place is the airport. I love airports because they are big and busy. There are people from many countries. Some people are happy because they go on holiday. Some people are sad because they say goodbye to their families.\n\nIn the airport, I like to drink coffee and watch the airplanes. The airplanes are very big. My favorite airplanes are the white and blue ones. The pilots look very smart in their uniforms. I want to wear that uniform one day.",
        "textTr": "En sevdiğim yer havalimanı. Havalimanlarını seviyorum çünkü büyük ve meşguller. Pek çok ülkeden insan var. Bazı insanlar mutlu çünkü tatile gidiyorlar. Bazı insanlar üzgün çünkü ailelerine veda ediyorlar.\n\nHavalimanında kahve içmeyi ve uçakları izlemeyi seviyorum. Uçaklar çok büyük. En sevdiğim uçaklar beyaz ve mavi olanlar. Pilotlar üniformaları içinde çok şık (zeki/havalı) görünüyorlar. Ben de bir gün o üniformayı giymek istiyorum.",
        "questions": [
            { "question": "Why does the writer love airports?", "options": ["Because they are quiet", "Because they are small", "Because they are big and busy", "Because they are cheap"], "answer": 2 },
            { "question": "Why are some people sad?", "options": ["Because they lose their bags", "Because they say goodbye to families", "Because they missed the flight", "Because the coffee is bad"], "answer": 1 },
            { "question": "What does the writer do at the airport?", "options": ["Buys a ticket", "Sleeps on the chair", "Drinks coffee and watches airplanes", "Flies a plane"], "answer": 2 },
            { "question": "Which airplanes does the writer like?", "options": ["Red and white", "White and blue", "Black and yellow", "Green and black"], "answer": 1 },
            { "question": "How do pilots look in their uniforms?", "options": ["Tired", "Sad", "Smart", "Old"], "answer": 2 }
        ],
        "vocabulary": ["busy", "holiday", "goodbye", "uniform", "smart"]
    },
    {
        "id": "a1_read_05",
        "title": "A Flight Attendant's Day",
        "level": "A1",
        "category": "aviation",
        "text": "Sarah is a flight attendant. She works for a big airline. She loves her job. \n\nBefore the flight, she goes to the airport and meets the captain and the other crew members. They talk about the flight. Then, she goes on the airplane. She checks the seats, the food, and the life vests.\n\nWhen the passengers come, she smiles and says 'Welcome'. She helps them find their seats. During the flight, she gives them food and water. Sarah works very hard, but she is happy because she travels the world.",
        "textTr": "Sarah bir kabin görevlisi. Büyük bir havayolu şirketi için çalışıyor. İşini çok seviyor.\n\nUçuştan önce havalimanına gider ve kaptanla ve diğer mürettebat üyeleriyle buluşur. Uçuş hakkında konuşurlar. Sonra uçağa gider. Koltukları, yemekleri ve can yeleklerini kontrol eder.\n\nYolcular geldiğinde gülümser ve 'Hoş geldiniz' der. Koltuklarını bulmalarına yardım eder. Uçuş sırasında onlara yemek ve su verir. Sarah çok sıkı çalışır ama mutludur çünkü dünyayı gezer.",
        "questions": [
            { "question": "What is Sarah's job?", "options": ["Pilot", "Teacher", "Engineer", "Flight attendant"], "answer": 3 },
            { "question": "Who does Sarah meet before the flight?", "options": ["The passengers", "The captain and crew", "Her family", "The airport police"], "answer": 1 },
            { "question": "What does Sarah check on the airplane?", "options": ["The engines", "The weather", "The seats, food, and life vests", "The tickets"], "answer": 2 },
            { "question": "What does Sarah do when passengers arrive?", "options": ["She sleeps", "She smiles and says Welcome", "She asks for passports", "She eats food"], "answer": 1 },
            { "question": "Why is Sarah happy?", "options": ["Because she has a lot of money", "Because the flights are short", "Because she travels the world", "Because she doesn't work hard"], "answer": 2 }
        ],
        "vocabulary": ["flight attendant", "meet", "crew", "during", "travel"]
    },
    {
        "id": "a1_read_06",
        "title": "Lost Luggage",
        "level": "A1",
        "category": "general",
        "text": "David is at the airport. He is on holiday in Spain, but he has a problem. He cannot find his bag.\n\nHe goes to the help desk. 'Excuse me,' David says. 'My bag is not on the carousel. It is a big, black bag. It has a red tag.'\n\nThe woman at the desk is friendly. 'Can I see your ticket and passport, please?' she asks. David gives her the passport. She looks at her computer. 'Ah, your bag is in Paris. It comes to Spain tonight. We will send it to your hotel tomorrow morning.' David says 'Thank you.'",
        "textTr": "David havalimanında. İspanya'da tatilde ama bir problemi var. Çantasını bulamıyor.\n\nDanışma (yardım) masasına gidiyor. 'Afedersiniz' diyor David. 'Çantam bagaj bandında değil. O büyük, siyah bir çanta. Kırmızı bir etiketi var.'\n\nMasadaki kadın cana yakın/arkadaş canlısı. 'Biletinizi ve pasaportunuzu görebilir miyim lütfen?' diye soruyor. David pasaportunu veriyor. Kadın bilgisayarına bakıyor. 'Ah, çantanız Paris'te. Bu gece İspanya'ya geliyor. Onu yarın sabah otelinize göndereceğiz.' David 'Teşekkür ederim' diyor.",
        "questions": [
            { "question": "Where is David on holiday?", "options": ["Paris", "Spain", "London", "Turkey"], "answer": 1 },
            { "question": "What is David's problem?", "options": ["He missed his flight", "He has no passport", "He cannot find his bag", "He is sick"], "answer": 2 },
            { "question": "What color is his bag?", "options": ["Red", "Black", "Blue", "Brown"], "answer": 1 },
            { "question": "Where is the bag now?", "options": ["In Spain", "At the hotel", "In David's hand", "In Paris"], "answer": 3 },
            { "question": "When does the bag go to the hotel?", "options": ["Tomorrow morning", "Tonight", "Next week", "Never"], "answer": 0 }
        ],
        "vocabulary": ["lost", "luggage", "problem", "carousel", "tag"]
    },
    {
        "id": "a1_read_07",
        "title": "The First Flight Lesson",
        "level": "A1",
        "category": "aviation",
        "text": "Today is an important day for Tom. It is his first flight lesson. He is very excited and a little nervous.\n\nHe meets his instructor, Mr. Green. Mr. Green is an old and experienced pilot. First, they walk around the small airplane. Mr. Green shows Tom the wings, the wheels, and the engine. This is called the 'pre-flight walkaround'. \n\nNext, they sit in the cockpit. There are many buttons and screens. Mr. Green explains how to start the engine. 'Are you ready?' asks Mr. Green. 'Yes, I am ready!' Tom says. The engine starts with a loud noise.",
        "textTr": "Bugün Tom için önemli bir gün. Bu onun ilk uçuş dersi. O çok heyecanlı ve biraz da gergin/sinirli.\n\nEğitmeni Bay Green ile buluşuyor. Bay Green yaşlı ve tecrübeli bir pilot. Önce küçük uçağın etrafında yürüyorlar. Bay Green, Tom'a kanatları, tekerlekleri ve motoru gösteriyor. Buna 'uçuş öncesi çevre kontrolü' denir.\n\nSonra, kokpite otururlar. Pek çok düğme ve ekran var. Bay Green motorun nasıl çalıştırılacağını açıklıyor. 'Hazır mısın?' diye soruyor Bay Green. 'Evet, hazırım!' diyor Tom. Motor yüksek bir sesle (gürültüyle) çalışıyor.",
        "questions": [
            { "question": "Why is Tom excited?", "options": ["It is his birthday", "He bought a new car", "It is his first flight lesson", "He is going on holiday"], "answer": 2 },
            { "question": "Who is Mr. Green?", "options": ["Tom's father", "The flight attendant", "A passenger", "The instructor"], "answer": 3 },
            { "question": "What do they do first?", "options": ["Start the engine", "Walk around the airplane", "Eat breakfast", "Call the tower"], "answer": 1 },
            { "question": "What is inside the cockpit?", "options": ["Bags", "Many buttons and screens", "Animals", "Food"], "answer": 1 },
            { "question": "How does Tom feel?", "options": ["Bored", "Angry", "Excited and nervous", "Tired"], "answer": 2 }
        ],
        "vocabulary": ["important", "nervous", "instructor", "experienced", "explain"]
    }
];

// ---------------------------------------------------------
// LISTENING DATA (a1-exercises.json) - Adding 5 more exercises
// ---------------------------------------------------------
const listeningExt = [
    {
        "id": "a1_listen_04",
        "title": "Kule ile İlk Temas",
        "level": "A1",
        "type": "atc",
        "text": "Istanbul Tower, this is Turkish One Two Three. Good morning. We are ready for pushback and engine start at gate 5.",
        "textTr": "İstanbul Kule, burası Turkish 123. Günaydın. 5 numaralı kapıda pushback (geri itme) ve motor çalıştırma için hazırız.",
        "questions": [
            { "question": "Who is the pilot calling?", "options": ["London Tower", "Istanbul Tower", "Paris Tower", "New York Tower"], "answer": 1 },
            { "question": "What is the flight callsign?", "options": ["Turkish One Two", "Turkish One Three Three", "Turkish One Two Three", "One Two Three"], "answer": 2 },
            { "question": "What are they ready for?", "options": ["Takeoff", "Landing", "Pushback and engine start", "Boarding"], "answer": 2 }
        ],
        "fillBlanks": [
            { "text": "Istanbul Tower, this is ___ One Two Three.", "answer": "Turkish" },
            { "text": "We are ___ for pushback.", "answer": "ready" },
            { "text": "Engine start at ___ 5.", "answer": "gate" }
        ]
    },
    {
        "id": "a1_listen_05",
        "title": "Yolcu İletişimi",
        "level": "A1",
        "type": "conversation",
        "text": "Excuse me, can I have some water, please? Yes, of course sir. Would you like ice with it? No, thank you, just still water. Here you go. Enjoy your flight.",
        "textTr": "Afedersiniz, biraz su alabilir miyim lütfen? Evet, elbette efendim. Buzlu mu istersiniz? Hayır, teşekkür ederim, sadece durgun (normal) su. Buyurun. İyi uçuşlar.",
        "questions": [
            { "question": "What does the passenger want?", "options": ["Coffee", "Tea", "Water", "Juice"], "answer": 2 },
            { "question": "Does the passenger want ice?", "options": ["Yes", "No", "Maybe", "I don't know"], "answer": 1 },
            { "question": "Who is the passenger talking to?", "options": ["The pilot", "Another passenger", "The flight attendant", "The police"], "answer": 2 }
        ],
        "fillBlanks": [
            { "text": "Excuse me, can I have some ___ , please?", "answer": "water" },
            { "text": "Would you like ___ with it?", "answer": "ice" },
            { "text": "Here you ___. Enjoy your flight.", "answer": "go" }
        ]
    },
    {
        "id": "a1_listen_06",
        "title": "Hava Durumu Raporu",
        "level": "A1",
        "type": "weather",
        "text": "This is the airport weather report. The temperature is 18 degrees Celsius. The wind is from the north at 10 knots. Visibility is good. There are no clouds. It is a beautiful day for flying.",
        "textTr": "Burası havalimanı hava durumu raporudur. Sıcaklık 18 derece Celsius. Rüzgar kuzeyden 10 knot hızında. Görüş mesafesi iyi. Bulut yok. Uçmak için güzel bir gün.",
        "questions": [
            { "question": "What is the temperature?", "options": ["10 degrees", "15 degrees", "18 degrees", "20 degrees"], "answer": 2 },
            { "question": "Where is the wind from?", "options": ["South", "North", "East", "West"], "answer": 1 },
            { "question": "How is the visibility?", "options": ["Bad", "Poor", "Good", "Zero"], "answer": 2 }
        ],
        "fillBlanks": [
            { "text": "The temperature is 18 ___ Celsius.", "answer": "degrees" },
            { "text": "The ___ is from the north.", "answer": "wind" },
            { "text": "___ is good. There are no clouds.", "answer": "Visibility" }
        ]
    },
    {
        "id": "a1_listen_07",
        "title": "Uçuş Gecikmesi",
        "level": "A1",
        "type": "announcement",
        "text": "Attention please. We are sorry to announce that flight TK 555 to Paris is delayed. The new departure time is 14:30. This is because of bad weather in Paris. Please wait at gate 22.",
        "textTr": "Lütfen dikkat. Paris'e giden TK 555 sefer sayılı uçuşun geciktiğini (rötar yaptığını) duyurmaktan üzüntü duyuyoruz. Yeni kalkış saati 14:30. Bunun nedeni Paris'teki kötü hava şartlarıdır. Lütfen 22 numaralı kapıda bekleyin.",
        "questions": [
            { "question": "Where is the flight going?", "options": ["London", "Istanbul", "Paris", "Berlin"], "answer": 2 },
            { "question": "Why is the flight delayed?", "options": ["Technical problem", "No pilot", "Bad weather", "Lost luggage"], "answer": 2 },
            { "question": "What is the new departure time?", "options": ["12:00", "13:30", "14:00", "14:30"], "answer": 3 }
        ],
        "fillBlanks": [
            { "text": "Flight TK 555 to Paris is ___.", "answer": "delayed" },
            { "text": "The new ___ time is 14:30.", "answer": "departure" },
            { "text": "Please wait at ___ 22.", "answer": "gate" }
        ]
    },
    {
        "id": "a1_listen_08",
        "title": "İniş Anonsu",
        "level": "A1",
        "type": "announcement",
        "text": "Ladies and gentlemen, we are beginning our descent into Istanbul. Please return to your seats and make sure your seatbelt is fastened securely. The cabin crew will now pass through the cabin to collect any rubbish.",
        "textTr": "Bayanlar ve baylar, İstanbul'a inişimize (alçalmamıza) başlıyoruz. Lütfen koltuklarınıza dönün ve emniyet kemerinizin güvenli bir şekilde bağlandığından emin olun. Kabin ekibi şimdi çöpleri (atıkları) toplamak için kabin içinden geçecektir.",
        "questions": [
            { "question": "What is the airplane doing?", "options": ["Taking off", "Descending", "Parking", "Refueling"], "answer": 1 },
            { "question": "What should passengers check?", "options": ["Tickets", "Passports", "Seatbelts", "Luggage"], "answer": 2 },
            { "question": "What will the crew collect?", "options": ["Tickets", "Luggage", "Money", "Rubbish"], "answer": 3 }
        ],
        "fillBlanks": [
            { "text": "We are beginning our ___ into Istanbul.", "answer": "descent" },
            { "text": "Please return to your ___.", "answer": "seats" },
            { "text": "The cabin crew will collect any ___.", "answer": "rubbish" }
        ]
    }
];


// Write files wrapper
function updateFile(fileRelPath, extArray) {
    const filePath = path.join(__dirname, '..', fileRelPath);
    let oldData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const oldIds = new Set(oldData.map(i => i.id));

    // Sadece ekli olmayanları append et
    let additions = 0;
    for (let item of extArray) {
        if (!oldIds.has(item.id)) {
            oldData.push(item);
            additions++;
        }
    }

    if (additions > 0) {
        fs.writeFileSync(filePath, JSON.stringify(oldData, null, 2), 'utf-8');
        console.log(`Updated ${fileRelPath} (+${additions} items)`);
    } else {
        console.log(`No new items for ${fileRelPath}`);
    }
}

updateFile('public/data/grammar/a1-lessons.json', grammarExt);
updateFile('public/data/reading/a1-passages.json', readingExt);
updateFile('public/data/listening/a1-exercises.json', listeningExt);

console.log("Grammar, Reading and Listening lessons successfully populated with comprehensive A1 pilot scenarios!");
