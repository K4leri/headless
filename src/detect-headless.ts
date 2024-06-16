// ------------------------------------------- 
// -         ОЧЕНЬ ВАЖНАЯ РЕМАРКА            -
// ------------------------------------------- 

// вообще headless давно уже непопулярен. Сейчас почти все уже на запросах работают
// детектить скорее в 80-90% случаев придется именно с бекенд составляющей, а не с фронта
// есть очень много разных техник для бекенда, которые позвляют задетектить подобное поведение, поэтому я делал бы упор 
// именно на бекенд составляющую





// что касается методов, то не всегда каждый метод четко может определить browserless среду. 
// я бы делал прогрессивную шкалу, которая позволит собирать несколько метрик, а уже на основе допущенных отклонений делать вывод о пользователе.
// в рамках тестового задания не делал. + тут всякие простые методы, можно копать гораздо глубже и всякие сравнительные методы делать, которые
// достанут инфу из одной части, из другой, и дальше инфуцормацию сравнивать уже будет. Вроде как есть несколько методов в канвасе, которые позволят задетектить 
// headless

// многие методы я сюда просто не включал, потому что надо логику писать и все такое. По типу сравнение времени на компе и по ip, првоерки видеокарты, проверка заряда ( у ноутбуков ),
// всякие там dns leak тесты, получение фингерпринтов от канваса и их сравнение уже и всякие другие штуки. Можно детектить Content Filters. Что уже больше говорить будет
// о человености. Всякие там прокси детектить. Собирать большие базы проксей спамеров, и не позволять выполнять действия

// а еще очень хорошая штука, чтобы всяких puputeer`ев заставить гореть, воткнуть алерт
// alert("Script executed!");
// но только ни в коем случае не в начале скрипта, а где-нибудь в середине, либо на одной из страничек, который должен будет исполнится
// но по факту это уже юзер экспериенс 


class DetectHeadless {
    isHeadless: boolean = false;

    detectUserAgent() {
        const userAgent = navigator.userAgent;
        console.log(userAgent)
        if (userAgent.includes("Headless") || userAgent.includes("PhantomJS")) {
            this.isHeadless = true;
        }
        if (/HeadlessChrome/.test(window.navigator.userAgent) || /Headless/.test(window.navigator.userAgent)) {
            console.log('userAgent detected');
            this.isHeadless = true;
        }
    }

    detectScreenResolutiion () {
        // насчет этого не уверен, но по идее это как можно обыграть в том числе
        // вообще тут более сложная логкиа нужна, потому что вроде как нули вообще не должны выпадать. 
        // надо брать стандартные разрешения всех разных мониторов (найти в сети можно) и уже от них оттакливаться и сравнивать
        // каждую переменную
        const windowOuterWidth = window.outerWidth;
        const windowOuterHeight = window.outerHeight;
        const windowInnerWidth = window.innerWidth;
        const windowInnerHeight = window.innerHeight;

        console.log(windowOuterWidth, windowOuterHeight, windowInnerWidth, windowInnerHeight)
        if (windowOuterWidth === 0 && windowOuterHeight === 0 && windowInnerWidth === 0 && windowInnerHeight === 0) {
            console.log('screen detected')
            this.isHeadless = true
        }
        const screen = window.screen;
        console.log(screen.availWidth, screen.availHeight)
        if (screen.availWidth === 0 && screen.availHeight === 0) {
            console.log('screen avail detected')
            this.isHeadless = true
        }
    }

    detectResolutionViaDocument () {
        const document = window.document;
        console.log(document.documentElement.clientWidth)
        console.log(document.documentElement.clientHeight)
        if (document.documentElement.clientWidth === 0 && document.documentElement.clientHeight === 0) {
            console.log('screen ViaDocumented detected')
            this.isHeadless = true
          }
    }

    detectThread () {
        // const deviceMemory = navigator.deviceMemory;
        // // Check 9: Device Memory
        // if (deviceMemory === 0) {
        //   isHeadless = true;
        // }
        const hardwareConcurrency = navigator.hardwareConcurrency;
        console.log(hardwareConcurrency)
        if (hardwareConcurrency === 0) {
            // в большинстве свеом подобные вещи запускаются на серверах, где выделяют 1 поток. 
            // Поэтому можно детектить с помощью потоков

            console.log('thread detected')
            this.isHeadless = true
        }
    }

    detectChrome () {
        // это уже в инете подсмотрел + он только для хрома. Но разные браузеры можно легко проверить на налиичие той или апишки.
        // например у оперы есть апишка, которой нет в другиз браузерах, предполагаю, что подобное есть и в других браузерах\
        try {
            //@ts-ignore
            if (eval.toString().length == 33 && !window.chrome) {
                console.log('chroome Detected')
                this.isHeadless = true
            }
            //@ts-ignore
            if (!window.chrome.runtime) {
                console.log('chroome Detected')
                this.isHeadless = true
            }
        } catch (error) {
            console.log(error)
        }
    }

    detectNotificationPermissions() {
        let isHeadless = this.isHeadless
        navigator.permissions.query({
            name: 'notifications'
        }).then(function(permissionStatus) {
            // console.log(Notification.permission)
            // console.log(permissionStatus.state)
            if (Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
                isHeadless = true
            } 
        });
    }

    detectPlugins() {
        const plugins = navigator.plugins;
        console.log(`detectPlugins = ${plugins.length}`)
        if (plugins.length === 0) {
            console.log('plugins detected')
            this.isHeadless = true
        }
    }


    detectAppVersiont () {
        const appVersion = navigator.appVersion;
        if (/headless/i.test(appVersion)) {
            console.log('app detected')
            this.isHeadless = true
        }
    }

    detectStyle () {
        // вроде как вокруг всяких стилей можно поиграть, а также количества установленных текстовых стилей на компьютер. Это тоже часто выдает.
        try {
            const stylesheet = document.styleSheets[0];
            const fontFaceRules = stylesheet.cssRules;
    
            console.log(`Number of font faces: ${fontFaceRules.length}`);
        } catch (e) {
            // вообще отсуствие вполне может говорить о headless
            console.log(e)
        }

    }

    detectLanguage () {
        // вроде как можно построить вокруг установленных языков еще в браузере. 
        // также смотреть на язык системы,язык браузера, и язык сети (по ip)
        // часто бывает, что языки не совпадают 
        const language = navigator.language;
        console.log(`язык ${language}, всего языков ${language.length }`)
        if (language === "" || language.length === 0) {
            console.log('language detected')
            this.isHeadless = true
        }
 
    }

    detectPlatformAndVendor () {
        // насчет этого не уверен, но тоже обыграть можно как-то
        const platform = navigator.platform;
        console.log(platform)
        //@ts-ignore
        if (platform === "") {
            console.log('platform detected')
            this.isHeadless = true
        }

        // 
        const vendor = navigator.vendor;
        console.log(vendor)
        if (vendor === "") {
            console.log('vendor detected')
            // во всех браузерах покажет вендора, но в мозиле не покажет, поэтому это не совсем явный показатель
            // this.isHeadless = true
        }
    }

    detectWebRTC () {
        // console.log(navigator.mediaDevices)
        // console.log(navigator.mediaDevices.getUserMedia.length)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('webRTC detected')
            this.isHeadless = true
        }
    }

    detectCanvas () {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");
        if (gl) {
            console.log(`WebGL version: ${gl.getParameter(gl.VERSION)}`);
            console.log(`WebGL vendor: ${gl.getParameter(gl.VENDOR)}`);
            console.log(`WebGL renderer: ${gl.getParameter(gl.RENDERER)}`);
            console.log(`WebGL shading language version: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);
        }
    
        if (!gl || !gl.getParameter(gl.VERSION)) {
            console.log('WebGL detected')
            this.isHeadless = true
        }
              
    }

    detectMultiObserver () {
        // Check 14: MutationObserver
        const observer = new MutationObserver(() => {});
        // console.log(observer)
        if (!observer) {
            console.log('MutationObserver detected')
            this.isHeadless = true
        }
    }

}

  
const detector = new DetectHeadless();

console.log('start calling methods')
// Call each method individually
detector.detectUserAgent();
detector.detectScreenResolutiion();
detector.detectResolutionViaDocument();
detector.detectThread();
detector.detectChrome();
detector.detectNotificationPermissions();
detector.detectPlugins();
detector.detectAppVersiont();
detector.detectStyle();
detector.detectLanguage();
detector.detectPlatformAndVendor();
detector.detectWebRTC();
detector.detectCanvas();
detector.detectMultiObserver();


console.log('end all of methods')
// Check the final result
if (detector.isHeadless) {
  console.log("Headless browser detected!");
} else {
  console.log("Not a headless browser.");
}