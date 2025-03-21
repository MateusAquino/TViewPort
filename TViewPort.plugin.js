module.exports = class TViewPort {
  /* ---- BetterStremio defined methods ---- */
  bsBlock = true;
  getName = () => "TViewPort";
  getImage = () =>
    "https://raw.githubusercontent.com/MateusAquino/TViewPort/main/logo.png";
  getDescription = () =>
    "A better Stremio experience for SmartTVs. Improve the default Web Stremio experience with a TV-friendly layout.";
  getVersion = () => "1.0.0";
  getAuthor = () => "MateusAquino";
  getShareURL = () => "https://github.com/MateusAquino/TViewPort";
  getUpdateURL = () =>
    "https://raw.githubusercontent.com/MateusAquino/TViewPort/main/TViewPort.plugin.js";
  onBoot = () => {};
  onReady = () => {
    document.body.classList.add("tv-viewport");
    window.TViewPort = {
      inactiveIters: 0,
      cinemetaCache: {},
      applyShortcut: (id) =>
        window.BetterStremio.Modules.shortcuts
          .getShortcuts()
          .find((el) => el.id === id)
          .handler(),
      toggleSidebar: () => {
        window.TViewPort.applyShortcut("toggle_sidebar");
        if (document.activeElement.id === "bs-sidebar-expand")
          document.querySelector("#bs-close-sidebar").focus();
        else document.querySelector("#bs-sidebar-expand").focus();
      },
      displayInfo: (item) => {
        item =
          item === false
            ? {
                name: BetterStremio.StremioRoot.translate("BUTTON_SEE_ALL"),
                background:
                  "https://raw.githubusercontent.com/MateusAquino/TViewPort/main/discovery.png",
                description: BetterStremio.StremioRoot.translate(
                  "WEBSITE_FEATURES_DISCOVER_P"
                ),
              }
            : item;
        const itemId = item._id ? item._id.split(" ")[0] : item.id;
        window.TViewPort.currentInfo = itemId;
        if (itemId && (item.description === "" || !item.description)) {
          const fetchMeta = `https://v3-cinemeta.strem.io/meta/${
            item.item_type || item.type
          }/${itemId}.json`;
          if (window.TViewPort.cinemetaCache[itemId]) {
            item = { ...item, ...window.TViewPort.cinemetaCache[itemId] };
          } else if (!item.fetchMeta) {
            fetch(fetchMeta)
              .catch((err) => console.error(err))
              .then((response) => response.json())
              .then((itemMeta) => {
                window.TViewPort.cinemetaCache[itemId] = itemMeta.meta;
                if (window.TViewPort.currentInfo === itemId)
                  window.TViewPort.displayInfo({
                    ...item,
                    description: null,
                    fetchMeta: true,
                  });
              });
          }
        }

        const name = document.querySelector("#tv-board-info h2");
        const runtime = document.querySelector(
          "#tv-board-info-tag span:nth-child(1)"
        );
        const year = document.querySelector(
          "#tv-board-info-tag span:nth-child(2)"
        );
        const genres = document.querySelector(
          "#tv-board-info-tag span:nth-child(3)"
        );
        const desc = document.querySelector("#tv-board-desc");
        const cast = document.querySelector("#tv-board-cast");
        const img = document.querySelector("#tv-board-img");
        const publishedYear = item.published
          ? `${item.published.getFullYear()}`
          : "";
        const yearValue = publishedYear
          ? publishedYear
          : item.year?.trim()?.replace?.(/^[–-]+|[–-]+$/g, "");
        const releaseInfoValue = item.releaseInfo
          ?.trim()
          ?.replace?.(/^[–-]+|[–-]+$/g, "");
        const yearParsed =
          yearValue === ""
            ? releaseInfoValue === ""
              ? undefined
              : releaseInfoValue
            : yearValue;
        const season = item.season ? `S${item.season}` : "";
        const episode = item.episode ? `E${item.episode}` : "";
        const seasonEpisode = `${season} ${episode}`.trim();
        const itemRuntime = item.runtime ? item.runtime : seasonEpisode;
        const itemDesc = item.description
          ? item.description
          : (item.episode && item.title
              ? `New Episode: ${item.title}`
              : ""
            ).trim();
        name.innerText = item.name ? item.name : "Unknown";
        runtime.innerText = itemRuntime?.replace?.(" ", "");
        runtime.style = itemRuntime ? "" : "display: none";
        year.innerText = yearParsed;
        year.style = yearParsed ? "" : "display: none";
        genres.innerText = item.genres?.join?.(" | ");
        genres.style = item.genres ? "" : "display: none";
        desc.innerText = itemDesc;
        desc.style = itemDesc ? "" : "display: none";
        cast.innerText = item.cast?.join?.(", ");
        cast.style = item.cast ? "" : "display: none";
        const itemBackground = item.background
          ? item.background.replace("/small/", "/medium/")
          : item.poster
          ? item.poster.replace("/poster/", "/background/")
          : item.logo;
        img.style.backgroundImage = itemBackground
          ? `url(${itemBackground})`
          : "";
      },
      mappedFocus: [
        {
          from: "#volumeControl",
          key: "ArrowUp",
          to: false,
        },
        {
          from: "#volumeControl",
          key: "ArrowDown",
          to: false,
        },
        {
          from: "#subIcon",
          key: "ArrowUp",
          to: '.toggle [type="checkbox"]',
        },
        {
          from: '.toggle [type="checkbox"]',
          key: "ArrowDown",
          to: ".selected[ng-click^='changeSubtitles']",
        },
        {
          from: "[ng-click^='incDelay'],[ng-click^='subSizeUp'],[ng-click^='subSizeDown']",
          key: "ArrowLeft",
          to: ".selected[ng-click^='changeSubtitles'],[ng-click^='incDelay'],[ng-click^='subSizeUp'],[ng-click^='subSizeDown']",
        },
        {
          from: "[ng-click^='incDelay'],[ng-click^='subSizeUp'],[ng-click^='subSizeDown']",
          key: "ArrowRight",
          to: "[ng-click^='incDelay'],[ng-click^='subSizeUp'],[ng-click^='subSizeDown']",
        },
        {
          from: "[ng-click^='subSizeUp'],[ng-click^='subSizeDown']",
          key: "ArrowDown",
          to: "#subIcon",
        },
        {
          from: "[ng-click^='incDelay']",
          key: "ArrowUp",
          to: ".selected[ng-click^='nextSubtitles']",
        },
        {
          from: "[ng-click^='nextSubtitles']",
          key: "ArrowLeft",
          to: "[ng-click^='nextSubtitles'],.selected[ng-click^='changeSubtitles']",
        },
        {
          from: "[ng-click^='changeSubtitles']",
          key: "ArrowRight",
          to: ".selected[ng-click^='nextSubtitles']",
        },
        {
          from: "[ng-click^='nextSubtitles']",
          key: "ArrowRight",
          to: "[ng-click^='nextSubtitles']",
        },
        {
          from: "[ng-click^='changeSubtitles']",
          key: "ArrowDown",
          to: "[ng-click^='changeSubtitles'],#subIcon",
        },
        {
          from: "[ng-click^='changeSubtitles']",
          key: "ArrowUp",
          to: '[ng-click^="changeSubtitles"],.toggle [type="checkbox"]',
        },
        {
          from: "[ng-click^='nextSubtitles']",
          key: "ArrowUp",
          to: '.toggle [type="checkbox"]',
        },
        {
          from: '.toggle [type="checkbox"],[ng-click^="changeSubtitles"]',
          key: "ArrowLeft",
          to: "#subIcon",
          allowChild: true,
        },
        {
          from: '[ng-click="changeSpeed(rate)"]',
          key: "ArrowDown",
          to: '[ng-click="changeSpeed(rate)"], #playbackSpeedControl',
        },
        {
          from: '[ng-click="changeSpeed(rate)"], #playbackSpeedControl',
          key: "ArrowUp",
          to: '[ng-click="changeSpeed(rate)"]',
        },
        {
          from: `.configure:not(.ng-hide):nth-child(6)`,
          key: "ArrowLeft",
          to: `.configure:not(.ng-hide):nth-child(5), #addons-list .addon:has(.configure:not(.ng-hide)), [ng-repeat="type in ['plugins', 'themes']"] .addon:has(.configure:not(.ng-hide))`,
          allowChild: true,
        },
        {
          from: `.configure:not(.ng-hide):nth-child(5)`,
          key: "ArrowLeft",
          to: `#addons-list .addon:has(.configure:not(.ng-hide)), [ng-repeat="type in ['plugins', 'themes']"] .addon:has(.configure:not(.ng-hide))`,
          allowChild: true,
        },
        {
          from: `.configure`,
          key: "ArrowLeft",
          to: `.configure:not(.ng-hide),#addons-list .addon:has(.configure:not(.ng-hide)), [ng-repeat="type in ['plugins', 'themes']"] .addon:has(.configure:not(.ng-hide))`,
          allowChild: true,
        },
        {
          from: "#board .board-container li .board-row li,#discover .content .items li,#library .items li",
          key: "ArrowLeft",
          to: "#board .board-container li .board-row li,#discover .content .items li,#library .items li,#navbar .tab.selected",
        },
        {
          from: `#board .board-container li .board-row li,
                 #discover .content .items li,
                 #library .items li,
                 #settingsPage .sections nav a,
                 #addons-list .addon,
                 [ng-repeat="type in ['plugins', 'themes']"] .addon,
                 .addon-content .right-pane .buttons a`,
          key: "ArrowLeft",
          to: "#navbar .tab.selected",
        },
        {
          from: "#global-search-field",
          key: "ArrowDown",
          to: "#board .board-container li .board-row li:first-child,#discover .content .items li:first-child,#library .items li:first-child",
        },
        {
          from: "#board .board-container li .board-row li,#discover .content .items li,#library .items li",
          key: "ArrowRight",
          to: "#board .board-container li .board-row li,#discover .content .items li,#library .items li",
        },
        {
          from: "#board .board-container li .board-row li,#discover .content .items li,#library .items li",
          key: "ArrowDown",
          to: "#board .board-container li .board-row li,#discover .content .items li,#library .items li",
        },
        {
          from: "#board .board-container li .board-row li,#discover .content .items li,#library .items li",
          key: "ArrowUp",
          to: "#board .board-container li .board-row li,#discover .content .items li,#library .items li, #discover-filters > div > select, #libraryFilters > div > select, #global-search-field",
        },
        {
          from: `[ng-change="searchAddons()"]`,
          key: "ArrowDown",
          to: "#addons-list .addon",
        },
        {
          from: "#navbar .tab",
          key: "ArrowUp",
          to: "#navbar .tab",
        },
        {
          from: "#navbar .tab",
          key: "ArrowLeft",
          to: false,
        },
        {
          from: "#navbar .tab",
          key: "ArrowDown",
          to: "#navbar .tab",
        },
        {
          from: "#navbar .tab",
          key: "ArrowRight",
          to: "#board .board-container li .board-row li:first-child,#discover .content .items li:first-child,#library .items li:first-child",
        },
        {
          from: ".filters .segments li",
          key: "ArrowLeft",
          to: ".filters .segments li, #navbar .tab.selected",
        },
        {
          from: ".filters .segments li",
          key: "ArrowRight",
          to: ".filters .segments li",
        },
        {
          from: `.filters .segments li`,
          key: "ArrowDown",
          to: `#addons-list .addon:first-child, [ng-repeat="type in ['plugins', 'themes']"] .addon:first-child`,
        },
        {
          from: `#addons-list .addon, [ng-repeat="type in ['plugins', 'themes']"] .addon`,
          key: "ArrowDown",
          to: `#addons-list .addon, [ng-repeat="type in ['plugins', 'themes']"] .addon`,
        },
        {
          from: `#addons-list .addon:has(.configure:not(.ng-hide)), [ng-repeat="type in ['plugins', 'themes']"] .addon:has(.configure:not(.ng-hide))`,
          key: "ArrowRight",
          to: `.configure:not(.ng-hide)`,
          allowChild: true,
        },
        {
          from: `.configure, .bs-update`,
          key: "ArrowUp",
          to: `.configure, .bs-update`,
        },
        {
          from: `.configure, .bs-update`,
          key: "ArrowDown",
          to: `.configure, .bs-update`,
        },
        {
          from: `#addons-list .addon, [ng-repeat="type in ['plugins', 'themes']"] .addon`,
          key: "ArrowUp",
          to: `#addons-list .addon, [ng-repeat="type in ['plugins', 'themes']"] .addon,.filters:first-child .segments li:first-child`,
        },
        {
          from: '[ng-model="selected.addon"]',
          key: "ArrowUp",
          to: '[ng-show="showBackButton()"].back',
        },
        {
          from: "body.immersed",
          key: "ArrowDown",
          to: `.shown > #bs-close-sidebar, .control:not(.ng-hide)[ng-show^="player.isComponentVisible('playpause')"]`,
          allowChild: true,
        },
        {
          from: "body.immersed",
          key: "ArrowRight",
          to: '[ng-player-progress="progressTime"]',
          allowChild: true,
        },
        {
          from: "body.immersed",
          key: "ArrowLeft",
          to: '[ng-player-progress="progressTime"],[ng-click="playerGoBack()"]',
          allowChild: true,
          reverseOrder: true,
        },
        {
          from: "body.immersed",
          key: "ArrowUp",
          to: '.shown > #bs-close-sidebar, [ng-click="playerGoBack()"]',
          allowChild: true,
        },
        {
          from: "body:not(.immersed)",
          key: "ArrowLeft",
          to: '#navbar .tab.selected,[ng-click="goBack()"]',
          allowChild: true,
        },
        {
          from: "body:not(.immersed)",
          key: "ArrowUp",
          to: '#global-search-field, [ng-click="goBack()"], #discover-filters > div > select, #libraryFilters > div > select, .filters .segments li',
          allowChild: true,
        },
        {
          from: "body:not(.immersed)",
          key: "ArrowDown",
          to: "#board > ul > li:nth-child(1) > ul > li:nth-child(1), div.episodes > ul > li:nth-child(1), #library-port > li:nth-child(1), #discover-items > li.item:nth-child(1), #series-calendar > ul.month > li.day.today, #addons > div.content > div:nth-child(1), #settingsPage > div.sections > nav > a:nth-child(1)",
          allowChild: true,
        },
        {
          from: "input[type='range']",
          key: "ArrowDown",
          to: `.control:not(.ng-hide)[ng-show^="player.isComponentVisible('playpause')"]`,
        },
        {
          from: ".control:not(.ng-hide),input[type='range'],[ng-click='playerGoBack()']",
          key: "ArrowDown",
          to: ".control:not(.ng-hide):first-child,input[type='range']",
        },
        {
          from: ".control:not(.ng-hide),input[type='range']",
          key: "ArrowUp",
          to: ".control:not(.ng-hide),input[type='range'],[ng-click='playerGoBack()']",
        },
        {
          from: "input[type='range']",
          key: "ArrowRight",
          to: false,
        },
        {
          from: "input[type='range']",
          key: "ArrowLeft",
          to: false,
        },
        {
          from: ".control:not(.ng-hide)",
          key: "ArrowLeft",
          to: ".control:not(.ng-hide)",
        },
        {
          from: ".control:not(.ng-hide)",
          key: "ArrowRight",
          to: ".control:not(.ng-hide)",
        },
      ],
      linkUser: async (token) => {
        if (window.BetterStremio.Modules.API.user) return;
        const overlay = document.querySelector("#bs-link-account-overlay");
        if (token) {
          window.BetterStremio.Modules.API.request("loginWithToken", {
            token,
          }).then(({ authKey, user }) => {
            if (!authKey) return console.error("Invalid token");
            window.BetterStremio.Modules.API.userChange(authKey, user);
            setTimeout(
              () => window.BetterStremio.StremioRoot.$state.go("board"),
              50
            );
            if (overlay) document.body.removeChild(overlay);
          });
          return;
        }
        const createLink = "https://link.stremio.com/api/v2/create?type=Create";
        const request = await fetch(createLink, { method: "POST" });
        const res = await request.json();
        if (!res.result.code) return console.error("Failed to create link");
        if (overlay) document.body.removeChild(overlay);
        window.TViewPort.showOverlay(
          res.result.code,
          res.result.link,
          res.result.qrcode
        );
      },
      showOverlay(code, textLink, qrCodeLink) {
        if (window.TViewPort.linking) clearInterval(window.TViewPort.linking);
        const setStyles = (el, styles) => Object.assign(el.style, styles);

        const overlay = document.createElement("div");
        overlay.id = "bs-link-account-overlay";
        setStyles(overlay, {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#201F2F",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        });

        const heading = document.createElement("h1");
        const qrImg = document.createElement("img");
        const p1 = document.createElement("p");
        const link = document.createElement("a");
        const p2 = document.createElement("p");
        const button = document.createElement("button");

        heading.textContent = "Link Account";
        heading.style.marginBottom = "20px";

        qrImg.src = qrCodeLink;
        setStyles(qrImg, {
          width: "200px",
          height: "200px",
          marginBottom: "20px",
        });

        p1.textContent = "1) Scan the QR code above or go to ";
        link.href = textLink;
        link.textContent = link.href;
        link.target = "_blank";
        setStyles(link, { color: "#4aa3df", textDecoration: "none" });
        p1.appendChild(link);
        p2.textContent = "2) Log in to your Stremio account";

        const timer = document.createElement("p");
        setStyles(timer, { fontSize: "24px", marginTop: "20px" });
        timer.textContent = "05:00";
        let totalTime = 300;
        const timerInterval = setInterval(async () => {
          totalTime = Math.max(totalTime - 1, 0);
          if (totalTime === 295) button.disabled = false;
          const minutes = String(Math.floor(totalTime / 60)).padStart(2, "0");
          const seconds = String(totalTime % 60).padStart(2, "0");
          timer.textContent = `${minutes}:${seconds}`;
          if (!totalTime) clearInterval(timerInterval);
          if (totalTime % 3 === 0) {
            const readLink = `https://link.stremio.com/api/v2/read?code=${code}`;
            const request = await fetch(readLink, { method: "POST" });
            const res = await request.json();
            if (res?.result?.authKey) {
              clearInterval(timerInterval);
              window.TViewPort.linkUser(res.result.authKey);
            }
          }
        }, 1000);
        window.TViewPort.linking = timerInterval;

        button.textContent = "Request a new link";
        button.disabled = true;
        setStyles(button, {
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4aa3df",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        });
        button.addEventListener("click", () => {
          window.TViewPort.linkUser();
        });

        overlay.append(heading, qrImg, p1, p2, timer, button);
        document.body.appendChild(overlay);
      },
    };

    window.BetterStremio.monkeyPatch("API", (API) => {
      window.TViewPort.isConnected = !!API.user;
      if (!API.user) window.TViewPort.linkUser();
      setInterval(() => {
        if (window.TViewPort.isConnected && !API.user)
          window.TViewPort.linkUser();
        window.TViewPort.isConnected = !!API.user;
      }, 250);
    });

    // Keep the player controls visible when interacting with them
    setInterval(() => {
      if (
        window.TViewPort.inactiveIters <= 4 &&
        document.activeElement.matches(
          ".control:not(.ng-hide),input[type='range'],[ng-click='playerGoBack()'],.control:not(.ng-hide) .popup *"
        )
      ) {
        window.TViewPort.inactiveIters++;
        window.TViewPort.applyShortcut("show_controls");
      } else if (window.TViewPort.inactiveIters === 5) {
        window.TViewPort.inactiveIters++;
        window.TViewPort.inactiveTimeout = setTimeout(() => {
          document.activeElement.blur();
          window.BetterStremio.Scopes.playerCtrl.bsMouseEnter(-1);
        }, 3500);
      }
    }, 500);

    BetterStremio.monkeyPatch("playerCtrl", (ctrl) => {
      ctrl.toggleSidebar = window.TViewPort.toggleSidebar;
      ctrl.bsProgressKeydown = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          const key = event.key === "ArrowLeft" ? "left" : "right";
          setTimeout(() => window.TViewPort.applyShortcut(key), 0);
        }
      };
      ctrl.bsVolumeKeydown = (event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          const key = event.key === "ArrowUp" ? "up" : "down";
          setTimeout(() => window.TViewPort.applyShortcut(key), 0);
        }
      };
    });

    BetterStremio.monkeyPatch(
      "boardCtrl",
      (ctrl) => (ctrl.displayInfo = window.TViewPort.displayInfo)
    );

    BetterStremio.monkeyPatch(
      "searchCtrl",
      (ctrl) => (ctrl.displayInfo = window.TViewPort.displayInfo)
    );

    const detailTpl = document.querySelector("#detailTpl");
    detailTpl.innerHTML = detailTpl.innerHTML.replace(
      /(ng-show\s*=\s*"showReceiveNotifCheckbox()\b)/g,
      'tabindex="-1" $1'
    );

    const playerTpl = document.querySelector("#playerTpl");
    playerTpl.innerHTML = playerTpl.innerHTML
      .replace(/(class\s*=\s*"control\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"incDelay\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"subSizeUp\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"subSizeDown\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"changeSpeed\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"playerGoBack\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"nextSubtitles\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-click\s*=\s*"changeSubtitles\b)/g, 'tabindex="-1" $1')
      .replace(/(ng-player\s*=\s*"progressTime\b)/g, 'tabindex="-1" $1')
      .replace(
        /(ng-player-progress\s*=\s*"progressTime\b)/g,
        'ng-keydown="bsProgressKeydown($event)" $1'
      )
      .replace(
        /(id\s*=\s*"volumeControl\b)/g,
        'ng-keydown="bsVolumeKeydown($event)" $1'
      )
      .replace(
        /(ng-controller\s*=\s*"sidebarCtrl\b[^>]+>)/g,
        `$1<div tabindex="-1" id="bs-close-sidebar" ng-click="toggleSidebar()" style=" width: 30px; top: 15px; right: 15px; position: absolute; "><svg icon="close" class="icon" viewBox="0 0 512 512"></svg></div>`
      )
      .replace(
        /(\<div\s*id\s*=\s*"settingsControl)/g,
        `<div id="bs-sidebar-expand" ng-focus="bsMouseEnter(-1)" ng-blur="bsMouseLeave()" ng-show="doesSidebarHaveData()" ng-click="toggleSidebar()" tabindex="-1" class="control"><svg icon="chevron-back" class="icon" viewBox="0 0 512 512"></svg></div> $1`
      );

    const tpls = document.querySelectorAll("#boardTpl,#searchTpl");
    tpls.forEach((tpl) => {
      tpl.innerHTML = tpl.innerHTML
        .replace(
          /(id="board"[^>]*?>)/g,
          `$1
          <div id="tv-board-info">
            <h2></h2>
            <div id="tv-board-info-tag"><span></span><span></span><span></span></div>
            <span id="tv-board-desc"></span>
            <span id="tv-board-cast"></span>
          </div>
          <div id="tv-board-img"></div>`
        )
        .replace(
          /(ng-repeat="item in category.libItems track|ng-repeat="item in result.metas track)/g,
          'ng-focus="displayInfo(item)" $1'
        )
        .replace(
          /(ng-repeat="notif in category.shown())/g,
          'ng-focus="displayInfo(notif)" $1'
        )
        .replace(
          /\{\{::item\.name\}\}<\/div><\/div><\/li>/g,
          '{{::item.name}}</div></div></li><li tabindex="-1" ng-focus="displayInfo(false)" class="board-item ng-scope tv-discovery-all" style="display: flex;justify-content: center;align-items: center;font-size: 2rem;" ui-sref="discover({ transportUrl: result.addon.transportUrl, type: result.type, catalog: result.id, genre: null })"><span>{{translate("BUTTON_SEE_ALL")}}<svg icon="chevron-forward" class="icon" viewBox="0 0 512 512"><path d="M184 400l144-144-144-144" style="stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:48;fill:none"></path></svg></span></li>'
        );
    });

    document
      .getElementById("search-form-container")
      .setAttribute("ng-hide", "!$state.is('search')");

    document
      .getElementById("global-search-field")
      .setAttribute("autofocus", "$state.is('search')");

    document
      .getElementById("global-search-field")
      .removeAttribute("on-keydown-key");

    document
      .querySelector('[ng-show="!searchQuery"]')
      .setAttribute("ng-show", "true");

    document
      .querySelector('[ng-show="showBackButton()"].back')
      .setAttribute("tabindex", "-1");

    stremioApp.run([
      function () {
        BetterStremio.StremioRoot.tabs.splice(0, 0, {
          id: 7,
          name: "Search",
          icon: "search",
          route: "search",
        });
      },
    ]);

    window.TViewPort.boot = true;
  };

  onEnable = (reload) => {
    this.onLoad();
    if (reload) return;
    setTimeout(() => window.BetterStremio.Internal.reloadUI(), 100);
  };

  onDisable = (reload) => {
    if (reload) return;
    setTimeout(() => window.BetterStremio.Internal.reloadUI(), 100);
  };

  onLoad = () => {
    if (!window.TViewPort?.boot)
      return window.BetterStremio.Internal.reloadUI();
    if (window.TViewPort?.load) return;

    const focusableSelectors =
      'a, button, input, textarea, select, #window-controls > li, [tab-name], [ng-click], [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = (selectors) => {
      const focusSelector =
        selectors === undefined ? focusableSelectors : selectors;
      return Array.from(document.querySelectorAll(focusSelector)).filter((e) =>
        e.checkVisibility()
      );
    };

    let currentFocus = null;

    // Helper function to find the next focusable element
    const findNextFocus = (
      current,
      direction,
      focusableSelectors,
      allowChild,
      reverseOrder
    ) => {
      const currentRect = current.getBoundingClientRect();
      const focusableElements = getFocusableElements(focusableSelectors);

      let bestMatch = null;
      let minDistance = reverseOrder ? -Infinity : Infinity;

      focusableElements.forEach((el) => {
        if (el === current) return;

        const rect = el.getBoundingClientRect();
        let distance = reverseOrder ? -Infinity : Infinity;

        switch (direction) {
          case "ArrowUp":
            if (rect.bottom - 1 <= currentRect.top || allowChild) {
              distance = Math.hypot(
                currentRect.left - rect.left,
                currentRect.top - rect.bottom
              );
            }
            break;
          case "ArrowDown":
            if (rect.top + 1 >= currentRect.bottom || allowChild) {
              distance = Math.hypot(
                currentRect.left - rect.left,
                rect.top - currentRect.bottom
              );
            }
            break;
          case "ArrowLeft":
            if (rect.right - 1 <= currentRect.left || allowChild) {
              distance = Math.hypot(
                currentRect.left - rect.right,
                currentRect.top - rect.top
              );
            }
            break;
          case "ArrowRight":
            if (rect.left + 1 >= currentRect.right || allowChild) {
              distance = Math.hypot(
                rect.left - currentRect.right,
                currentRect.top - rect.top
              );
            }
            break;
        }

        if (
          (distance < minDistance && !reverseOrder) ||
          (distance > minDistance && reverseOrder)
        ) {
          minDistance = distance;
          bestMatch = el;
        }
      });

      return bestMatch;
    };

    // Update focus to a new element
    const updateFocus = (newFocus) => {
      currentFocus = newFocus;
      if (currentFocus) {
        currentFocus.focus({ preventScroll: false });
      }
    };

    // Disable default stremio shortcuts
    BetterStremio.Modules.shortcuts.disable("up");
    BetterStremio.Modules.shortcuts.disable("down");
    BetterStremio.Modules.shortcuts.disable("left");
    BetterStremio.Modules.shortcuts.disable("right");

    // Event listener for remote control navigation
    document.body.addEventListener("keydown", (event) => {
      window.TViewPort.inactiveIters = 0;
      if (window.TViewPort.inactiveTimeout)
        clearInterval(window.TViewPort.inactiveTimeout);
      let directions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (event.key !== "Enter" && !directions.includes(event.key)) return;
      if (directions.includes(event.key)) {
        if (currentFocus !== null && currentFocus !== document.activeElement) {
          currentFocus = document.activeElement;
          return;
        }
        const focusedElement = currentFocus || document.activeElement;
        const focusIf = window.TViewPort.mappedFocus.find(
          (focusIf) =>
            focusIf.key === event.key &&
            focusedElement?.matches?.(focusIf.from) &&
            (focusIf.to === false ||
              document
                .querySelectorAll(focusIf.to)
                .values()
                .find((e) => e.checkVisibility()))
        );
        event.preventDefault();
        if (focusIf?.to === false) return;
        const nextFocus = focusIf
          ? findNextFocus(
              focusedElement,
              event.key,
              focusIf.to,
              focusIf.allowChild,
              focusIf.reverseOrder
            )
          : findNextFocus(focusedElement, event.key);
        if (
          nextFocus &&
          (!window.TViewPort.debounceScroll || !nextFocus.matches("li"))
        )
          updateFocus(nextFocus);
        if (
          nextFocus &&
          !window.TViewPort.debounceScroll &&
          nextFocus.matches("#board .board-container li .board-row li")
        )
          if (["ArrowUp", "ArrowDown"].includes(event.key)) {
            window.TViewPort.debounceScroll = true;
            setTimeout(() => (window.TViewPort.debounceScroll = false), 450);
          } else if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            window.TViewPort.debounceScroll = true;
            setTimeout(() => (window.TViewPort.debounceScroll = false), 200);
          }
      } else if (
        event.key === "Enter" &&
        document.activeElement &&
        document.activeElement.matches("div > select")
      ) {
        document.activeElement.dispatchEvent(new MouseEvent("mousedown"));
      }
    });

    // Recalculate focusable elements if DOM changes
    const observer = new MutationObserver(() => {
      if (currentFocus !== document.activeElement) {
        currentFocus = document.activeElement;
      }

      const focusableElementsY = document.querySelectorAll(
        "#board .board-container > li"
      );
      const focusableElementsX = document.querySelectorAll(
        "#board .board-container li .board-row li"
      );

      const alignToTop = (el) =>
        el.parentElement.scrollTo({ top: el.offsetTop });

      const alignToLeft = (el) =>
        el.parentElement.scrollTo({ left: el.offsetLeft });

      focusableElementsY.forEach((el) => {
        if (!el.tvFocusInjected) {
          el.addEventListener("focusin", () => alignToTop(el));
          el.tvFocusInjected = true;
        }
      });

      focusableElementsX.forEach((el) => {
        if (!el.tvFocusInjected) {
          el.addEventListener("focus", () => alignToLeft(el));
          el.tvFocusInjected = true;
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.TViewPort.load = true;
  };
  styles = `/**
 * @name TV Theme
 * @description A better Stremio experience for SmartTVs. Improve your Stremio experience with a more friendly TV layout.
 * @updateUrl
 * @version 1.0.0
 * @author MateusAquino
 */

:root {
  --navbar-width: 8rem;
}

body #topbar .logo {
  height: 8rem;
}

[ui-view] {
  position: fixed;
  width: calc(100% - var(--navbar-width));
}

.heading-button,
.user-menu,
[board-carousel-arrow],
[href="#settings-shortcuts"],
[translate="ADDON_CATALOGUE"],
[ng-click="toggleFullscreen()"],
[ng-click="openInBrowser()"],
[ng-click="openChangelog()"],
[ng-click="openFolder()"],
[ng-show="searchQuery"],
.controls #streamingReport,
.controls #castingControl,
.controls #settingsControl,
.share:not(.bs-update),
.info-box .content .actions,
#detail .content,
#introModal,
#sidebar-handle,
#search-dropdown,
#settings-shortcuts,
#settings-user-prefs .category:nth-child(2),
#board .board-container li .board-row li .info {
  display: none !important;
}

#betterstremio-version {
  justify-content: center;
  margin-top: unset !important;
}

.remove:focus,
.install:focus,
.configure:focus,
[ng-class="!enabled(name) && 'remove'"]:focus {
  box-shadow: 0 0 0 2pt #ffffff;
}

.addon .buttons .configure-uninstall:not(.ng-hide) {
  display: flex !important;
}

[ng-controller="sidebarCtrl"] {
  position: fixed;
  left: 0;
}

[ng-controller="searchCtrl"] {
  padding-top: 1rem !important;
}

#player .sidebar {
  left: unset;
}

#navbar {
  justify-content: center !important;
}

#board {
  padding-top: 3rem;
}

#board .board-container {
  -webkit-mask: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 30%,
    rgba(255, 255, 255, 1) 40%
  );
  height: calc(100vh - 35vh - var(--topbar-height));
  padding-bottom: 50vh;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth !important;
  overflow-y: hidden;
}

#board .board-container > li {
  height: 45vh;
  scroll-snap-align: start;
  margin-bottom: 0;
}

#board .board-container li .board-row {
  height: 100%;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth !important;
  overflow-x: hidden;
  padding-right: 100vw;
}

#board .board-container li .board-row li {
  height: 100% !important;
  width: 21vh !important;
  scroll-snap-align: start;
  scroll-margin-left: 18px;
}

/* #board .board-container li .board-row li:not(.tv-discovery-all):focus {
  -webkit-box-shadow: unset !important;
  box-shadow: unset !important;
} */

#board .board-container li .board-row li:focus {
  transform: unset !important;
}

#board .board-container li .board-row li:focus .thumb {
  transform: scale(1.06);
  -webkit-box-shadow: 0 0 0 0.17rem #fff;
  box-shadow: 0 0 0 0.17rem #fff;
}

#tv-board-img {
  z-index: -1;
  height: 60vh;
  background-size: cover;
  background-position: center;
  image-rendering: -webkit-optimize-contrast;
  position: fixed;
  right: 0;
  top: 0;
  width: 70vw !important;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask: radial-gradient(
      farthest-corner at 80% 20%,
      rgba(0, 0, 1, 1) 30%,
      rgba(0, 0, 1, 0) 65%
    ),
    radial-gradient(
      farthest-corner at 70% 0%,
      rgba(0, 0, 1, 1) 30%,
      rgba(0, 0, 1, 0) 65%
    ),
    radial-gradient(
      farthest-side at 120% -20%,
      rgba(0, 0, 1, 1) 30%,
      rgba(0, 0, 1, 1) 70%,
      rgba(0, 0, 1, 0) 100%
    );
  opacity: 0.35;
}

#tv-board-info {
  height: 35vh;
  margin-top: 0.75rem;
}

#tv-board-info h2 {
  font-size: 3.3em;
  margin-bottom: 1.1rem;
  padding-right: 13rem;
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
}

#tv-board-info-tag {
  font-size: 1.1em;
  margin-bottom: 1.1rem;
}

#tv-board-info-tag span {
  margin-right: 2rem;
}

#tv-board-desc {
  width: 40vw;
  display: block;
  font-size: 1.2em;
  margin-bottom: 1.1rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

#tv-board-cast {
  color: gray;
  font-size: 1.2em;
  padding-right: 13rem;
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
  display: block;
}

div.control:focus,
[ng-click="playerGoBack()"]:focus,
[ng-click="goBack()"]:focus > .button {
  box-shadow: 0 0 0 2pt #ffffff !important;
  border-radius: 0.75rem;
}

[ng-click="goBack()"] {
  box-shadow: unset;
  outline: none;
}

input[ng-player-progress="progressTime"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 2pt #ffffff !important;
}

input[ng-player-progress="progressTime"]:focus::-moz-range-thumb {
  box-shadow: 0 0 0 2pt #ffffff !important;
}

#board .board-container li .board-row li .image .placeholder {
  background-position: center;
}

#board .board-container li .board-row {
  padding-bottom: calc(2.5rem + 1.5rem);
}

#board .board-container li .board-row li:focus {
  -webkit-box-shadow: 0 0 0 0.17rem #fff !important;
  box-shadow: 0 0 0 0.17rem #fff !important;
}
    `;
};
