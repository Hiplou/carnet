const SHARED_HEAD = `<!doctype html><html lang="fr"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex"/>
<meta name="googlebot" content="noindex, nofollow"/>
<meta name="referrer" content="no-referrer"/>
<title>Postes — Battue</title><style>
:root{--stone-900:#1c1917;--stone-700:#44403c;--stone-500:#78716c;--stone-400:#a8a29e;--stone-200:#e7e5e4;--stone-100:#f5f5f4;--paper:#faf9f7;--emerald:#166534;--emerald-d:#14532d;--amber-l:#b45309}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:var(--stone-100);color:var(--stone-900);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.45}
.wrap{max-width:640px;margin:0 auto;padding-bottom:40px}
header{background:var(--stone-900);color:#fafaf9;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}
header .k{display:flex;align-items:center;gap:12px;min-width:0}
.emo{font-size:28px}
header h1{font-family:Georgia,serif;font-size:20px;margin:0}
header p{margin:2px 0 0;color:var(--stone-400);font-size:12px}
.back{background:#292524;color:#e7e5e4;border:none;font-size:12px;padding:7px 10px;border-radius:8px;white-space:nowrap}
.sos{position:fixed;top:calc(9px + env(safe-area-inset-top));right:11px;z-index:70;background:#b91c1c;color:#fff;border:2px solid rgba(255,255,255,.55);border-radius:999px;padding:8px 14px;font-size:13px;font-weight:800;letter-spacing:.02em;box-shadow:0 3px 12px rgba(0,0,0,.35)}
header{padding-right:106px}
.sosnum{display:flex;gap:9px;margin-bottom:12px}
.sosnum a{flex:1;text-align:center;background:#b91c1c;color:#fff;text-decoration:none;border-radius:13px;padding:15px 6px;font-size:19px;font-weight:800;line-height:1.15}
.sosnum a small{display:block;font-size:11px;font-weight:600;opacity:.9;margin-top:2px}
.sospos{background:#f5f5f4;border:1px solid #e7e5e4;border-radius:12px;padding:12px;margin-bottom:12px}
.sospos button{width:100%;background:#1c1917;color:#fafaf9;border:0;border-radius:10px;padding:12px;font-size:14px;font-weight:700}
.sosgps{font-size:21px;font-weight:800;text-align:center;color:#1c1917;margin:10px 0 4px;letter-spacing:.01em;word-break:break-all}
.soshint{font-size:11.5px;color:#78716c;text-align:center;margin:0}
.soscard{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:11px;margin-bottom:8px}
.soscard .qui{flex:1;min-width:0}
.soscard .rol{font-size:10.5px;text-transform:uppercase;letter-spacing:.09em;color:#a8a29e;font-weight:700}
.soscard .nom{font-size:14.5px;font-weight:700;color:#1c1917}
.soscard a{background:#166534;color:#fff;text-decoration:none;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:700;white-space:nowrap}
.soscard .sanstel{font-size:11.5px;color:#a8a29e;white-space:nowrap}
main{padding:16px}
.card{background:var(--paper);border:1px solid var(--stone-200);border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.04);margin-bottom:16px;overflow:hidden}
.card .pad{padding:14px 16px}
.eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--stone-400);margin:0 0 6px}
.hero .pad{background:linear-gradient(180deg,#f0f7f1,var(--paper))}
.hero h2{font-family:Georgia,serif;margin:0;font-size:20px;color:var(--emerald-d)}
.hero .post{font-size:26px;font-weight:700;margin:2px 0 0}
.extra{margin-top:6px;color:var(--stone-700);font-size:14px}
.consigne{background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:10px 12px;margin-top:12px;font-size:14px;color:#7c2d12;display:flex;gap:8px}
.consigne b{white-space:nowrap}
.postphoto{width:100%;border-radius:10px;border:1px solid var(--stone-200);margin-top:12px;display:block}
.feedback{margin-top:14px;border-top:1px dashed var(--stone-200);padding-top:12px}
.fbintro{font-size:13px;color:var(--stone-500);margin:0 0 10px}
.fbblock{border:1px solid var(--stone-200);border-radius:14px;padding:14px;margin-bottom:14px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.fbblock:last-of-type{margin-bottom:16px}
.fbhd{display:flex;align-items:center;gap:9px;margin-bottom:6px}
.fbdot{width:13px;height:13px;border-radius:50%;flex:0 0 auto}
.fbtt{font-weight:700;font-size:16px;line-height:1.15}
.fbtt small{display:block;font-weight:500;color:var(--stone-500);font-size:12px}
.fblab{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--stone-400);margin:12px 0 6px}
.counter{display:flex;align-items:center;gap:16px}
.cbtn{width:48px;height:48px;border-radius:50%;border:2px solid var(--stone-200);background:#fff;font-size:26px;line-height:1;color:var(--stone-700);display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}
.cbtn:active{background:var(--stone-100);transform:scale(.94)}
.cval{font-size:30px;font-weight:800;min-width:44px;text-align:center;color:var(--stone-900)}
input.cval{width:56px;border:none;background:transparent;padding:0;-webkit-appearance:none;appearance:none}
input.cval:focus{outline:none;background:#f5f5f4;border-radius:8px}
.counter.sm{gap:10px}
.counter.sm .cbtn{width:38px;height:38px;font-size:20px}
.counter.sm input.cval{font-size:20px;width:42px;min-width:42px}
.preleve{display:flex;flex-direction:column;gap:8px}
.prow{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--stone-200);border-radius:10px;padding:6px 8px 6px 12px}
.pemo{font-size:14px;font-weight:600;color:var(--stone-700)}
.pills{display:flex;gap:8px}
.pill{flex:1;padding:12px 4px;border-radius:11px;border:2px solid var(--stone-200);background:#fff;font-size:14px;font-weight:700;color:var(--stone-500);-webkit-tap-highlight-color:transparent}
.pill.on-bon{background:#dcfce7;border-color:#16a34a;color:#15803d}
.pill.on-rep{background:#fef3c7;border-color:#d97706;color:#b45309}
.pill.on-dng{background:#fee2e2;border-color:#dc2626;color:#b91c1c}
.fbcom{width:100%;border:1px solid var(--stone-200);border-radius:11px;padding:11px;font-size:15px;font-family:inherit;box-sizing:border-box}
.fbsend{width:100%;background:var(--emerald);color:#fff;border:none;border-radius:13px;padding:16px;font-size:17px;font-weight:800;letter-spacing:.01em}
.fbsend:disabled{opacity:1}
.fbov{position:fixed;inset:0;background:rgba(28,25,23,.55);display:flex;align-items:flex-end;justify-content:center;z-index:60;animation:fade .15s ease}
@keyframes fade{from{opacity:0}to{opacity:1}}
.fbsheet{background:#fff;width:100%;max-width:520px;border-radius:20px 20px 0 0;padding:20px;max-height:85vh;overflow:auto;box-shadow:0 -8px 30px rgba(0,0,0,.2)}
.fbsheet h3{margin:0 0 3px;font-family:Georgia,serif;font-size:21px}
.fbsheet .sub{color:var(--stone-500);font-size:13px;margin:0 0 14px}
.recap{border:1px solid var(--stone-200);border-radius:12px;padding:12px 13px;margin-bottom:9px}
.recap b{display:block;font-size:14px;color:var(--stone-900)}
.recap span{font-size:13px;color:var(--stone-600)}
.fbov .row{display:flex;gap:10px;margin-top:14px}
.fbov .row button{flex:1;padding:15px;border-radius:13px;font-size:15px;font-weight:800;border:none;-webkit-tap-highlight-color:transparent}
.bmod{background:var(--stone-200);color:var(--stone-700)}
.bcon{background:var(--emerald);color:#fff}
.fbrow{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
.fbrow label{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--stone-400)}
.fbrow input,.fbrow select{border:1px solid var(--stone-200);border-radius:8px;padding:9px 10px;font-size:15px;background:#fff;font-family:inherit}
.fbbtn{width:100%;background:var(--emerald);color:#fff;border:none;border-radius:9px;padding:11px;font-size:15px;font-weight:600;margin-top:2px}
.fbbtn:disabled{background:var(--stone-400)}
.fbmsg{font-size:13px;margin:8px 0 0;text-align:center}
h3.sec{font-family:Georgia,serif;font-size:17px;margin:0 0 4px;display:flex;align-items:center;gap:8px}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.tab{border:1px solid var(--stone-200);background:#fff;color:var(--stone-700);font-size:14px;font-weight:600;padding:7px 14px;border-radius:8px}
.tab.active{background:var(--emerald);border-color:var(--emerald);color:#fff}
.maphint{font-size:11px;color:var(--stone-400);text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}
.map{position:relative;width:100%;height:0;overflow:hidden;border-radius:10px;border:1px solid var(--stone-200);background:#ddd}
.map-bg{position:absolute;inset:0;background-repeat:no-repeat}
.marker{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px}
.marker .dot{width:14px;height:14px;border-radius:50%;background:var(--c,#dc2626);border:2px solid #fff;box-shadow:0 0 2px rgba(0,0,0,.5)}
.marker .lbl{font-size:9px;line-height:1.1;background:rgba(28,25,23,.7);color:#fff;padding:1px 4px;border-radius:4px;white-space:nowrap}
.marker.mine .dot{width:22px;height:22px;background:var(--amber-l);border-width:3px;box-shadow:0 0 0 6px rgba(180,83,9,.28)}
.marker.mine .lbl{background:var(--amber-l);font-weight:700}#map .marker .lbl{display:none}#map .marker.mine .lbl{display:block}.conetoggle.off{opacity:.45}.conetoggle.off input{pointer-events:none}
.marker.mine{animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{filter:none}50%{filter:drop-shadow(0 0 6px rgba(180,83,9,.65))}}
ul.list{margin:6px 0 0;padding-left:0;list-style:none}
ul.list li{display:flex;gap:8px;font-size:14px;color:var(--stone-700);padding:5px 0;border-bottom:1px solid var(--stone-200)}
ul.list li:last-child{border-bottom:none}
.son .ev{font-weight:600;color:var(--stone-900);min-width:42%}
.rule{display:flex;gap:8px}.rule .p{color:var(--emerald)}
footer{text-align:center;color:var(--stone-400);font-size:12px;padding:8px 16px 0}
.pickwrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:18px;background:linear-gradient(160deg,#14532d,#1c1917)}
.pickcard{background:var(--paper);border-radius:16px;max-width:460px;width:100%;padding:22px;box-shadow:0 12px 40px rgba(0,0,0,.35)}
.pickhead{display:flex;align-items:center;gap:12px;margin-bottom:6px}
.pickhead h1{font-family:Georgia,serif;font-size:22px;margin:0}
.pickhead p{margin:2px 0 0;color:var(--stone-500);font-size:13px}
.pickq{font-weight:600;margin:16px 0 10px}
.names{display:flex;flex-direction:column;gap:8px;max-height:38vh;overflow:auto}
.tirlab{font-size:14px;font-weight:700;color:var(--stone-900);margin:4px 0 8px}.tirgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}.tirbtn{background:#fff;border:1.5px solid var(--stone-200);border-radius:12px;padding:14px 0;font-family:Georgia,serif;font-size:22px;font-weight:700;color:var(--stone-900)}.prenombox{display:flex;gap:6px;margin:6px 0 4px}.prenombox input{flex:1;min-width:0;border:1px solid #d6d3d1;border-radius:10px;padding:9px 11px;font-size:16px}.prenombox button{background:#166534;color:#fff;border:0;border-radius:10px;padding:9px 13px;font-weight:700}.namebtn{text-align:left;background:#fff;border:1px solid var(--stone-200);border-radius:10px;padding:13px 14px;font-size:16px;font-weight:600;color:var(--stone-900)}
.namebtn:active{background:#ecfdf5;border-color:var(--emerald)}
.empty{color:var(--stone-500);font-style:italic}
.role{border-radius:12px;padding:14px;margin-top:14px}
.role-c{background:#f0fdf4;border:1px solid #bbf7d0}
.role-r{background:#eff6ff;border:1px solid #bfdbfe}
.rolehd{display:flex;align-items:center;gap:8px;margin-bottom:3px}
.rolehd h2{font-family:Georgia,serif;font-size:19px;margin:0;color:var(--stone-900)}
.rolico{font-size:22px}
.rolesub{font-size:13px;color:var(--stone-500);margin:0 0 10px}
.rolebtn{width:100%;margin-top:4px;background:#2563eb;color:#fff;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:600}
.rolebtn:active{background:#1d4ed8}
.ro2{margin-top:14px;text-align:center;color:var(--stone-400);font-size:12px}
.modal{position:fixed;inset:0;background:rgba(28,25,23,.55);display:flex;align-items:center;justify-content:center;z-index:50;padding:24px}.modalcard{background:#fff;border-radius:18px;max-width:340px;width:100%;padding:26px 22px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}.modalemo{font-size:44px;margin-bottom:6px}.modalcard h2{font-family:Georgia,serif;font-size:22px;margin:0 0 8px;color:#1c1917}.modalcard p{color:#57534e;font-size:15px;line-height:1.5;margin:0 0 18px}.modalbtn{background:#166534;color:#fff;border:none;border-radius:12px;padding:13px 18px;font-size:16px;font-weight:700;width:100%}.banner{background:#fffbeb;border:1px solid #fde68a}.banner .sec{color:#b45309}.tilegrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}.tile{text-align:left;background:#fff;border:1px solid #e7e5e4;border-radius:16px;padding:15px 14px;display:flex;flex-direction:column;gap:7px;min-height:104px;box-shadow:0 1px 2px rgba(0,0,0,.04);cursor:pointer;font-family:inherit;color:#1c1917}.tile:active{transform:scale(.97)}.tile .ico{font-size:27px;line-height:1}.tile .tl{font-size:16px;font-weight:800}.tile .hint{font-size:12px;color:#78716c;line-height:1.3}.tile.wide{flex-direction:row;align-items:center;min-height:auto;gap:12px;width:100%;margin-bottom:12px}.tile.wide .ico{font-size:25px}.tile.wide .txt{flex:1}.tile.wide .go{margin-left:auto;color:#a8a29e;font-size:20px}.tile.ret{background:linear-gradient(180deg,#fff,#f0fdf4);border-color:#a7f3d0}.sheet-back{position:fixed;inset:0;background:rgba(28,25,23,.5);display:none;align-items:flex-end;justify-content:center;z-index:45}.sheet-back.open{display:flex}.sheet{background:#fff;width:100%;max-width:520px;border-radius:22px 22px 0 0;padding:8px 18px 26px;max-height:88vh;overflow:auto;animation:sheetup .22s ease}@keyframes sheetup{from{transform:translateY(28px)}to{transform:translateY(0)}}.grab{width:40px;height:5px;border-radius:999px;background:#e7e5e4;margin:8px auto 14px}.sheeth{font-size:22px;margin:0 0 12px}.close{width:100%;margin-top:18px;background:#166534;color:#fff;border:none;border-radius:13px;padding:14px;font-size:16px;font-weight:800}.hownote{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:12px 14px;font-size:14px;color:#14532d;line-height:1.5;margin-bottom:14px}.priv{font-size:12.5px;color:#78716c;display:flex;align-items:center;gap:6px;margin-top:12px}.conetoggle{display:flex;align-items:center;gap:9px;margin-top:12px;font-size:15px;font-weight:700;color:#1c1917;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:10px;padding:10px 12px}.conetoggle input{width:20px;height:20px;accent-color:#166534}.conelegend{display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;font-size:12.5px;color:#57534e}.conelegend .lg{display:inline-flex;align-items:center;gap:6px}.conelegend .sw{width:15px;height:15px;border-radius:3px;display:inline-block;border:1px solid rgba(0,0,0,.15);flex-shrink:0}.conelegend .sw.green{background:rgba(134,239,172,.75)}.conelegend .sw.red{background:rgba(252,165,165,.85)}.conelegend .sw.hatch{background:repeating-linear-gradient(45deg,rgba(248,113,113,.6) 0 3px,#fff 3px 6px)}.talkiepill{margin-top:12px;font-size:14px;font-weight:800;color:#166534;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;padding:7px 14px;align-items:center;gap:6px}.fbtraque{border:1px solid #e7e5e4;border-radius:12px;padding:12px;margin-bottom:12px;background:#fff}.fbtraque.fbdone{background:#f0fdf4;border-color:#a7f3d0}.fbtraque.fbediting{border-color:#fca5a5}.fbsentrow{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.fbok{color:#166534;font-weight:800;font-size:15px}.fbmod{background:#fff;border:1px solid #d6d3d1;border-radius:9px;padding:8px 14px;font-size:14px;font-weight:700;color:#57534e}.fbwarn{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;border-radius:9px;padding:8px 10px;font-size:13px;font-weight:600;margin:8px 0}.fbsendall{width:100%;background:#166534;color:#fff;border:none;border-radius:12px;padding:14px;font-size:16px;font-weight:800;margin:4px 0 8px}.fbpost{border-top:1px dashed #e7e5e4;margin-top:10px;padding-top:10px}.fbpost-t{font-weight:800;color:#1c1917;font-size:14px;margin:0 0 6px}.fbtraque .fbsend{width:100%;margin-top:10px}.fbrien{width:100%;background:#166534;color:#fff;border:none;border-radius:12px;padding:16px;font-size:17px;font-weight:800;margin:6px 0 14px}.fbmini{background:none;border:none;color:#b45309;font-size:14px;font-weight:700;text-decoration:underline;padding:8px 0;margin-top:4px}.fbadv{margin-top:6px}.fbwarnov{background:#fffbeb;border:1px solid #fde68a;color:#78350f;border-radius:10px;padding:10px 12px;font-size:14px;font-weight:600;margin-bottom:12px}.counter{gap:12px;touch-action:manipulation}.cbtn{min-width:54px;min-height:54px;font-size:26px;touch-action:manipulation}.cval{min-height:54px;font-size:22px;min-width:66px;border:2px solid #d6d3d1;border-radius:10px;text-align:center;font-weight:800;touch-action:manipulation}.counter.sm .cbtn{min-width:44px;min-height:44px;font-size:22px}.counter.sm .cval{min-height:44px;font-size:19px;min-width:54px}.fbtqhead{width:100%;display:flex;align-items:center;gap:10px;background:transparent;border:none;padding:10px 2px;font-size:17px;font-weight:800;color:#1c1917;text-align:left}.fbhname{flex:1}.fbbadge{font-size:12px;font-weight:800;border-radius:999px;padding:3px 9px;white-space:nowrap}.fbbadge.todo{background:#f5f5f4;color:#78716c}.fbbadge.done{background:#dcfce7;color:#166534}.fbchev{font-size:13px;color:#a8a29e}.fbtqbody{padding:2px 0 4px}.fbgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}.fbsq{aspect-ratio:1/1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#fff;border:2px solid #e7e5e4;border-radius:16px;padding:12px;text-align:center;cursor:pointer;font-family:inherit}.fbsq.done{background:#f0fdf4;border-color:#a7f3d0}.fbsqdot{width:16px;height:16px;border-radius:50%}.fbsqname{font-size:17px;font-weight:800;color:#1c1917;line-height:1.15}.fbsqbadge{font-size:12px;font-weight:700;color:#78716c}.fbsq.done .fbsqbadge{color:#166534}.fbback{background:#f5f5f4;border:1px solid #e7e5e4;border-radius:10px;padding:11px 15px;font-size:15px;font-weight:700;color:#57534e;margin-bottom:12px}.fbformhd{display:flex;align-items:center;gap:8px;font-family:Georgia,serif;font-size:20px;font-weight:700;margin-bottom:10px;color:#1c1917}.gpsm{position:absolute;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 0 1px #2563eb;z-index:3;cursor:pointer}.gpsm.moi{box-shadow:0 0 0 1px #2563eb,0 0 0 9px rgba(37,99,235,.22)}.gpsm.rab{background:transparent;border:0;box-shadow:none;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:14px solid #ea580c;filter:drop-shadow(0 0 1.5px #fff)}.gpsm.vieux{opacity:.45}.gpsbulle{position:absolute;transform:translate(-50%,-135%);background:#1c1917;color:#fff;font-size:12px;line-height:1.35;padding:5px 9px;border-radius:8px;white-space:nowrap;z-index:6;pointer-events:none}.gpsgo{width:100%;background:#2563eb;color:#fff;border:none;border-radius:12px;padding:14px;font-size:16px;font-weight:800;margin-top:8px}.gpsstop{width:100%;background:#fff;color:#b91c1c;border:1px solid #fca5a5;border-radius:12px;padding:12px;font-size:15px;font-weight:700;margin-top:12px}.gpsetat{background:#eff6ff;color:#1e40af;border-radius:10px;padding:9px 11px;font-size:13px;line-height:1.45}.gpswarn{background:#fff7ed;border:1px solid #fed7aa;color:#7c2d12;border-radius:10px;padding:8px 10px;font-size:12.5px;margin-top:10px}.gpssel{width:100%;padding:11px;border:1px solid #d6d3d1;border-radius:10px;font-size:15px;margin:4px 0 6px;background:#fff}.chatlist{max-height:50vh;min-height:150px;overflow:auto;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:14px;padding:10px 8px;margin:6px 0 10px;-webkit-overflow-scrolling:touch}.cjour{text-align:center;font-size:11px;color:#a8a29e;margin:8px 0 6px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.cm{max-width:84%;width:max-content;margin:0 0 6px;padding:7px 10px 8px;border-radius:14px;background:#fff;border:1px solid #e7e5e4;font-size:15px;line-height:1.35;color:#1c1917;overflow-wrap:anywhere}.cm.moi{margin-left:auto;background:#dcfce7;border-color:#bbf7d0}.cm.org{background:#fffbeb;border-color:#fcd34d}.cm.sel{box-shadow:0 0 0 2px #f59e0b}.cmh{font-size:12px;color:#78716c;margin-bottom:2px}.cmh b{color:#1c1917}.cmorg{display:inline-block;background:#d97706;color:#fff;font-size:10px;font-weight:800;border-radius:6px;padding:1px 5px;margin-left:4px;vertical-align:1px}.cmact{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.cmact button,.chatadm button{flex:1;border:1px solid #d6d3d1;background:#fff;border-radius:8px;padding:8px;font-size:13px;font-weight:600;color:#44403c}.cmact button.arm,.chatadm button.arm{background:#b91c1c;border-color:#b91c1c;color:#fff}.chatform{display:flex;gap:8px;align-items:flex-end}.chatform textarea{flex:1;min-width:0;border:1px solid #d6d3d1;border-radius:12px;padding:10px 12px;font-size:16px;font-family:inherit;resize:none;height:44px;max-height:120px;background:#fff}.chatform button{background:#166534;color:#fff;border:0;border-radius:12px;padding:12px 15px;font-size:15px;font-weight:700}.chatform button:disabled{opacity:.5}.chaterr{color:#b91c1c;font-size:13px;margin:6px 0 0}.chatnote{font-size:13px;color:#57534e;margin:2px 0 4px}.chatnote button{background:none;border:0;color:#166534;text-decoration:underline;font-size:13px;padding:0 0 0 4px}.chatorga{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:8px 10px;font-size:13px;color:#92400e;margin:4px 0 6px}.chatvide{text-align:center;color:#a8a29e;font-size:14px;padding:34px 10px}.chatbadge{background:#dc2626;color:#fff;border-radius:999px;font-size:12px;font-weight:800;min-width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;padding:0 6px;flex:none}.chattoast{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:60;background:#1c1917;color:#fafaf9;border-radius:14px;padding:10px 14px;font-size:14px;max-width:92vw;box-shadow:0 10px 30px rgba(0,0,0,.3);display:none;cursor:pointer}.chatadm{margin-top:12px;border-top:1px solid #e7e5e4;padding-top:10px}.chatadm h4{margin:0 0 6px;font-size:13px;color:#44403c}.chatbl{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f5f5f4;font-size:14px}.chatbl span{flex:1}.chatbl button{flex:none}.gpslab{font-size:13px;font-weight:700;color:#44403c;display:block;margin-top:6px}.gpsmsg{color:#b91c1c;font-size:13px;margin:6px 0 0}.gpshors{font-size:12px;color:#78716c;margin:6px 0 0}.gpsul{margin:8px 0 0;padding-left:18px}#gpsMap .marker .lbl{display:none}#gpsMap .marker.mine .lbl{display:block}.gpsleg{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;font-size:12.5px;color:#57534e}.gpsleg span{display:inline-flex;align-items:center;gap:6px}.gpsleg .gpsm{position:static;transform:none;display:inline-block;cursor:default}</style></head><body>
<div id="welcome" class="modal"><div class="modalcard"><div class="modalemo">👋</div><h2>Bienvenue !</h2><p>Pour voir <b>ton poste</b>, <b>ta traque</b> et tes consignes, appuie sur <b>ton prénom</b> dans la liste ci-dessous.</p><button id="welcomeBtn" class="modalbtn">👍 J'ai compris</button></div></div><div id="retourHelp" class="modal" style="display:none"><div class="modalcard"><div class="modalemo">📋</div><h2>Comment faire ton retour</h2><p>Pour réaliser ton retour : <b>sélectionne la traque</b>. Si tu as tiré, indique le <b>nombre de balles par poste</b>. Et si tu as <b>prélevé un animal</b>, indique-le.</p><button id="retourHelpBtn" class="modalbtn">👍 J'ai compris</button></div></div>
<div id="pick" class="pickwrap"><div class="pickcard">
<div class="pickhead"><span class="emo">🦌</span><div><h1 id="pickTitle">Carnet de Battue</h1><p id="subpick"></p></div></div>
<div class="role role-c"><div class="rolehd"><span class="rolico">🦌</span><h2>Chasseurs</h2></div><p class="rolesub">Choisis ton nom pour voir ton poste :</p><div id="names" class="names"></div></div>
<div class="role role-r"><div class="rolehd"><span class="rolico">🥁</span><h2>Rabatteurs</h2></div><p class="rolesub">Traques, annonces et consignes de sécurité.</p><div id="rabnames" class="names"></div><button class="rolebtn" onclick="enterRabatteurs()">Voir les traques &amp; consignes</button></div><div id="talkiePill" class="talkiepill" style="display:none"></div>
<p class="ro2">🔒 Lecture seule — tu ne peux rien modifier</p></div></div>
<button class="sos" onclick="ouvrirUrgence()">🚨 Urgence</button>
<div id="appview" class="wrap" style="display:none">
<header><div class="k"><span class="emo">🦌</span><div><h1 id="myName">—</h1><p id="subapp"></p></div></div><button id="back" class="back" onclick="backToPick()">Changer de nom</button></header>
<main>
<div class="card hero"><div class="pad"><h3 class="sec">📍 Ton poste</h3><div id="extra" class="extra"></div><div id="myTraque" style="display:none"></div><div id="myPost" style="display:none"></div></div></div>
<div class="card banner" id="attribsCard" style="display:none"><div class="pad"><h3 class="sec">🎯 Attributions du jour</h3><div id="attribs"></div></div></div>\n
<div class="tilegrid"><button class="tile" onclick="openSheet('carte')"><span class="ico">🗺️</span><span class="tl">Ma carte</span><span class="hint">Où est mon poste</span></button><button class="tile" onclick="openSheet('poste')"><span class="ico">📸</span><span class="tl">Mon poste</span><span class="hint">Photo &amp; consignes</span></button><button class="tile" onclick="openSheet('annonces')"><span class="ico">📻</span><span class="tl">Annonces</span><span class="hint">Sonneries &amp; infos</span></button><button class="tile" onclick="openSheet('securite')"><span class="ico">🛡️</span><span class="tl">Sécurité</span><span class="hint">Consignes à respecter</span></button></div>
<button class="tile wide ret" onclick="openSheet('retour')"><span class="ico">📋</span><span class="txt"><span class="tl">Envoyer mon retour</span><br><span class="hint">Dis à l'organisateur ce que tu as vu / tiré</span></span><span class="go">→</span></button>
<button class="tile wide" id="chatTile" onclick="openChat()" style="display:none"><span class="ico">💬</span><span class="txt"><span class="tl">Chat de la journée</span><br><span class="hint" id="chatHint">Discute avec les chasseurs et les rabatteurs</span></span><span class="chatbadge" id="chatBadge" style="display:none"></span><span class="go">→</span></button>
<button class="tile wide" id="gpsTile" onclick="openGps()" style="display:none"><span class="ico">📡</span><span class="txt"><span class="tl">Suivi GPS live</span><br><span class="hint">Où sont les chasseurs et les traqueurs</span></span><span class="go">→</span></button>
<button class="tile wide" onclick="openJeu()" style="margin-top:10px"><span class="ico">🐗</span><span class="txt"><span class="tl">La Course du Sanglier</span><br><span class="hint">Un peu long à ton poste ? Fais un score.</span></span><span class="go">→</span></button>
<div class="card" id="chefCard" style="display:none"><div class="pad"><h3 class="sec">👨‍✈️ Tu es chef de ligne</h3><p class="maphint">Postes sous ta responsabilité :</p><div id="chefPosts"></div><div id="chefTabs" style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0 0"></div><div class="map" id="chefMap" style="margin-top:8px;display:none"></div></div></div>
<footer>Document en lecture seule — transmis par l'organisateur.</footer>
</main>
<div class="sheet-back" id="sheet-carte" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">🗺️ Ma carte</h2><p class="maphint">Ton poste est surligné en orange.</p><div class="tabs" id="mapTabs" style="margin-bottom:10px"></div><div class="map" id="map"></div><label class="conetoggle"><input type="checkbox" id="deposeToggle" checked onchange="toggleDepose(this.checked)"> <span>🚗 Afficher ma dépose</span></label><label class="conetoggle" style="margin-top:8px"><input type="checkbox" id="departToggle" checked onchange="toggleDepart(this.checked)"> <span>🚩 Afficher les départs de traque</span></label><label class="conetoggle" style="margin-top:8px"><input type="checkbox" id="coneToggle" onchange="toggleCones(this.checked)"> <span>Afficher les zones de sécurité</span></label><label class="conetoggle" style="margin-top:8px"><input type="checkbox" id="rdvToggle" onchange="toggleRdv(this.checked)"> <span>🚩 Afficher le RDV après la traque</span></label><label class="conetoggle" style="margin-top:8px"><input type="checkbox" id="zoneToggle" onchange="toggleZone(this.checked)"> <span>Afficher le contour de la traque</span></label><div class="conelegend"><span class="lg"><i class="sw green"></i> Tir autorisé</span><span class="lg"><i class="sw hatch"></i> Angle 30° — ne pas tirer</span><span class="lg"><i class="sw red"></i> Interdit — ne jamais tirer</span></div><button class="close" onclick="closeSheet()">Fermer</button></div></div>
<div class="sheet-back" id="sheet-poste" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth" id="postInfoTitle">📍 Ton poste</h2><div class="tabs" id="postTabs" style="margin-bottom:10px"></div><div id="postInfoCard"><div id="myChef" style="display:none;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:8px;padding:6px 10px;font-size:14px;font-weight:600;color:#1c1917;margin-bottom:8px"></div><div class="consigne" id="myConsigne" style="display:none"><b>⚠️ Consignes :</b><span></span></div><div id="myPhotos"></div></div><button class="close" onclick="closeSheet()">Fermer</button></div></div>
<div class="sheet-back" id="sheet-annonces" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">🔔 Annonces &amp; sonneries</h2><ul class="list son" id="sonneries"></ul><button class="close" onclick="closeSheet()">Fermer</button></div></div>
<div class="sheet-back" id="sheet-securite" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">🛡️ Consignes de sécurité</h2><ul class="list" id="consignes"></ul><button class="close" onclick="closeSheet()">Fermer</button></div></div>
<div class="sheet-back" id="sheet-urgence" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">🚨 Urgence</h2>
<div class="sosnum"><a href="tel:18">18<small>Pompiers</small></a><a href="tel:15">15<small>SAMU</small></a></div>
<div class="sospos"><button onclick="maPosition()">📍 Ma position</button><p id="sosGps" class="sosgps" style="display:none"></p><p id="sosHint" class="soshint">Donne ces chiffres aux secours pour qu ils te trouvent.</p></div>
<div id="sosGens"></div>
<button class="close" onclick="closeSheet()">Fermer</button></div></div>
<div class="sheet-back" id="sheet-jeu" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">🐗 La Course du Sanglier</h2>
<div id="jeuPseudoBox" style="display:none;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:10px;padding:12px;margin-bottom:10px">
  <p style="margin:0 0 8px;font-size:14px;color:#44403c">Choisis un pseudo pour signer tes scores.</p>
  <div style="display:flex;gap:8px">
    <input id="jeuPseudo" maxlength="14" placeholder="Ton pseudo" style="flex:1;min-width:0;border:1px solid #d6d3d1;border-radius:8px;padding:9px 11px;font-size:15px;background:#fff">
    <button onclick="jeuSetPseudo()" style="background:var(--emerald);color:#fafaf9;border:0;border-radius:8px;padding:9px 16px;font-size:14px;font-weight:600">OK</button>
  </div>
  <p id="jeuPseudoErr" style="margin:6px 0 0;font-size:12px;color:#b91c1c;display:none"></p>
</div>
<div id="jeuBox" style="display:none">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
    <span style="font-size:13px;color:#78716c">Salut <b id="jeuMoi" style="color:#1c1917"></b> <button onclick="jeuChangePseudo()" style="background:none;border:0;color:#166534;font-size:12px;text-decoration:underline;padding:0 0 0 4px">changer</button></span>
    <span style="font-size:13px;color:#78716c"><b id="jeuScore" style="color:#1c1917;font-size:15px">0</b> m · record <span id="jeuBest">0</span></span>
  </div>
  <canvas id="jeuCv" width="800" height="300" style="display:block;width:100%;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:10px;touch-action:manipulation"></canvas>
  <div style="display:flex;justify-content:space-between;font-size:11px;color:#78716c;margin:8px 0 4px"><span>Distance de la meute</span><span id="jeuDogTxt">à bonne distance</span></div>
  <div style="height:7px;background:#e7e5e4;border-radius:4px;overflow:hidden"><i id="jeuDogBar" style="display:block;height:100%;background:var(--emerald);width:100%"></i></div>
  <p style="font-size:12px;color:#a8a29e;text-align:center;margin:10px 0 0">Touche l'écran pour sauter. Deux fautes et les chiens te rattrapent.</p>
  <h3 class="sec" style="margin-top:16px">🏆 Les cinq meilleurs</h3>
  <ol id="jeuTop" style="margin:0;padding:0 0 0 22px;font-size:14px;color:#44403c"><li style="color:#a8a29e">chargement…</li></ol>
  <p id="jeuSync" style="font-size:11px;color:#a8a29e;margin:8px 0 0;text-align:center"></p>
</div>
<button class="close" onclick="closeSheet()">Fermer</button></div></div>
<div class="sheet-back" id="sheet-retour" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">📋 Ton retour</h2><div class="hownote">👉 Après ta traque, dis à l'organisateur ce qui s'est passé : indique tes balles tirées et l'état du mirador, poste par poste, puis envoie.</div><div id="feedbackCard"><div id="fbList"></div></div><div class="priv">🔒 Ton retour est privé, envoyé uniquement à l'organisateur.</div><button class="close" onclick="closeSheet()">Fermer</button></div></div></div>
<div class="sheet-back" id="sheet-chat" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">💬 Chat de la journée</h2><div id="chatInfo"></div><div id="chatList" class="chatlist" style="display:none"></div><div id="chatForm" class="chatform" style="display:none"><textarea id="chatTxt" maxlength="500" placeholder="Écris un message…" oninput="chatAuto(this)"></textarea><button id="chatBtn" onclick="chatEnvoyer()">Envoyer</button></div><p id="chatErr" class="chaterr"></p><div id="chatAdmin"></div><button class="close" onclick="closeSheet()">Fermer</button></div></div><div id="chatToast" class="chattoast" onclick="openChat()"></div>
<div class="sheet-back" id="sheet-gps" onclick="if(event.target===this)closeSheet()"><div class="sheet"><div class="grab"></div><h2 class="sheeth">📡 Suivi GPS live</h2><div id="gpsBody"></div><button class="close" onclick="closeSheet()">Fermer</button></div></div>
<script>var DATA = `;

const SHARED_TAIL = `;
var AR=1.5, me=null;
/* La carte d une traque vit dans DATA.images, rangee par secteur. */
function imgDe(t){ return (t&&t.sec&&DATA.images&&DATA.images[t.sec])||DATA.image||""; }
/* Chaque secteur a sa propre capture : on mesure les proportions de chacune. */
var ARS={};
function arDe(t){
  var src=imgDe(t);if(!src)return AR;
  if(ARS[src])return ARS[src];
  ARS[src]=AR;
  var im2=new Image();
  im2.onload=function(){
    if(!im2.naturalWidth||!im2.naturalHeight)return;
    ARS[src]=im2.naturalWidth/im2.naturalHeight;
    var mp=$("map");if(mp&&mp.innerHTML!=="")renderMap(MAP_I);
    var cm=$("chefMap");if(cm&&cm.innerHTML!=="")renderChefMap(CHEF_I);
  };
  im2.src=src;
  return ARS[src];
}
var DEF_IMG="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 520' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#d7e7f2'/><stop offset='1' stop-color='#eef2e4'/></linearGradient></defs><rect width='900' height='520' fill='url(#sky)'/><circle cx='720' cy='120' r='46' fill='#f4ecd8'/><path d='M0 360 Q225 300 450 350 T900 340 V520 H0 Z' fill='#7fa060'/><path d='M0 410 Q250 360 520 400 T900 395 V520 H0 Z' fill='#5f8049'/><path d='M0 460 Q300 430 600 455 T900 450 V520 H0 Z' fill='#496b3a'/><g fill='#33502c'><polygon points='120,360 150,300 180,360'/><polygon points='128,382 150,330 172,382'/><rect x='146' y='378' width='8' height='24' fill='#5a3d24'/><polygon points='760,352 792,285 824,352'/><polygon points='768,374 792,318 816,374'/><rect x='788' y='370' width='9' height='26' fill='#5a3d24'/></g><g><rect x='420' y='250' width='60' height='60' rx='4' fill='#7a5a3a'/><polygon points='410,250 450,214 490,250' fill='#63472c'/><rect x='432' y='262' width='36' height='30' fill='#3f3020'/><rect x='426' y='310' width='10' height='150' fill='#63472c'/><rect x='464' y='310' width='10' height='150' fill='#63472c'/><line x1='426' y1='360' x2='474' y2='360' stroke='#63472c' stroke-width='7'/><line x1='426' y1='410' x2='474' y2='410' stroke='#63472c' stroke-width='7'/></g></svg>");
function $(id){return document.getElementById(id);}
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
function fmtDate(d){try{return cap(new Date(d).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));}catch(e){return d;}}
function myMir(ti){if(!me)return null;for(var k=0;k<me.posts.length;k++){if(me.posts[k].traqueIndex===ti)return me.posts[k].miradorId;}return null;}
function monRabat(ti){return !!(me&&me.rabats&&me.rabats.indexOf(ti)>=0);}
var MAP_I=0;
function renderMap(index){MAP_I=index;var t=DATA.traques[index];var c=t.crop;var map=$("map");map.style.paddingBottom=((c.h/c.w)/arDe(t)*100)+"%";map.innerHTML="";var bg=document.createElement("div");bg.className="map-bg";var fw=c.w/100,fh=c.h/100,fx=c.x/100,fy=c.y/100;bg.style.backgroundImage="url('"+imgDe(t)+"')";bg.style.backgroundSize=(100/fw)+"% "+(100/fh)+"%";bg.style.backgroundPosition=(fw<1?fx/(1-fw)*100:0)+"% "+(fh<1?fy/(1-fh)*100:0)+"%";map.appendChild(bg);function coneDiv(lx,ly,cc,color){var d=document.createElement('div');d.style.cssText='position:absolute;left:'+lx+'%;top:'+ly+'%;width:2400px;height:2400px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:1;background:conic-gradient(from '+(cc.dir-cc.width/2)+'deg, '+color+' 0deg '+cc.width+'deg, transparent '+cc.width+'deg 360deg)';return d;}function bandDiv(lx,ly,start,w){var d=document.createElement('div');d.style.cssText='position:absolute;left:'+lx+'%;top:'+ly+'%;width:2400px;height:2400px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:1;background:repeating-linear-gradient(45deg, rgba(248,113,113,.5) 0 6px, rgba(255,255,255,.9) 6px 12px);-webkit-mask-image:conic-gradient(from '+start+'deg, #000 0deg '+w+'deg, transparent '+w+'deg 360deg);mask-image:conic-gradient(from '+start+'deg, #000 0deg '+w+'deg, transparent '+w+'deg 360deg)';return d;}function greenDisk(lx,ly){var d=document.createElement('div');d.style.cssText='position:absolute;left:'+lx+'%;top:'+ly+'%;width:2400px;height:2400px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:1;background:rgba(134,239,172,0.28)';return d;}/*__TIRRENDER__*/var myId=myMir(index);if(SHOW_RDV)(function(){var mine=null;for(var q=0;q<(me.posts||[]).length;q++){if(me.posts[q].traqueIndex===index){mine=me.posts[q];break;}}var wanted=(mine&&mine.chefId)||"";if(!wanted&&(me.chefMids||[]).length){var lst0=t.rdv||[];for(var z=0;z<lst0.length;z++){if(me.name&&lst0[z].chefName===me.name){wanted=lst0[z].chefId;break;}}}if(!wanted)return;var list=t.rdv||[];for(var w=0;w<list.length;w++){if(list[w].chefId!==wanted)continue;var r=list[w];var flx=(r.gx-c.x)/c.w*100,fly=(r.gy-c.y)/c.h*100;if(flx<-4||flx>104||fly<-4||fly>104)return;var fd=document.createElement("div");fd.style.cssText="position:absolute;left:"+flx+"%;top:"+fly+"%;transform:translate(-50%,-100%);z-index:5;display:flex;flex-direction:column;align-items:center;pointer-events:none";fd.innerHTML="<span style='background:#b45309;color:#fff;font-size:11px;font-weight:800;padding:3px 7px;border-radius:6px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.3)'>\uD83D\uDEA9 RDV apr\u00e8s la traque</span><span style='width:2px;height:11px;background:#b45309'></span>";map.appendChild(fd);return;}})();(function(){var dep=t.deposes||[],dpt=t.departs||[],tr=t.transport||{};var utilises={};for(var q in tr){if(tr[q]&&tr[q].departId)utilises[tr[q].departId]=1;}function poser(d,couleur,icone){if(!isFinite(d.gx)||!isFinite(d.gy))return;var lx=(d.gx-c.x)/c.w*100,ly=(d.gy-c.y)/c.h*100;if(lx<-5||lx>105||ly<-5||ly>105)return;var el=document.createElement('div');el.style.cssText='position:absolute;left:'+lx+'%;top:'+ly+'%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:none;z-index:2';el.innerHTML="<span style='width:13px;height:13px;border-radius:50%;background:"+couleur+";border:2px solid #fff;box-shadow:0 0 2px rgba(0,0,0,.5)'></span>"+"<span style='font-size:9px;line-height:1.1;background:rgba(255,255,255,.85);color:#1c1917;padding:1px 4px;border-radius:4px;white-space:nowrap'>"+icone+" "+aesc(d.nom)+"</span>";map.appendChild(el);}if(SHOW_DEPOSE&&typeof me!=='undefined'&&me&&me.id){var moi=me.id,maV=null,vv=t.voitures||[];for(var w=0;w<vv.length;w++){if(vv[w].conducteurId===moi){maV=vv[w];break;}var pz=vv[w].passagers||[];for(var y=0;y<pz.length;y++){if(pz[y].id===moi){maV=vv[w];break;}}if(maV)break;}var ptDe=function(id){if(!id)return null;for(var i=0;i<dep.length;i++){if(dep[i].id===id)return dep[i];}return null;};var trouve=ptDe((tr[moi]||{}).deposeId)||ptDe(maV&&maV.deposeId);if(trouve)poser(trouve,'#1c1917','\u{1F17F}\u{FE0F}');}if(SHOW_DEPART)for(var j2=0;j2<dpt.length;j2++)poser(dpt[j2],'#166534','\u{1F6A9}');})();(function(){if(!SHOW_ZONE)return;var z=t.zone||[];if(z.length<2)return;var pts=z.map(function(q){return ((q.gx-c.x)/c.w*100)+' '+((q.gy-c.y)/c.h*100);});var d='M '+pts.join(' L ')+((t.zoneFermee&&z.length>=3)?' Z':'');var NSZ='http://www.w3.org/2000/svg';var sv=document.createElementNS(NSZ,'svg');sv.setAttribute('viewBox','0 0 100 100');sv.setAttribute('preserveAspectRatio','none');sv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';var col=t.color||'#dc2626';function trait(couleur,ep,op){var pa=document.createElementNS(NSZ,'path');pa.setAttribute('d',d);pa.setAttribute('fill','none');pa.setAttribute('stroke',couleur);pa.setAttribute('stroke-width',ep);pa.setAttribute('stroke-linejoin','round');pa.setAttribute('stroke-linecap','round');pa.setAttribute('opacity',op);pa.setAttribute('vector-effect','non-scaling-stroke');return pa;}sv.appendChild(trait('#ffffff','5','.55'));sv.appendChild(trait(col,'3.5','.85'));map.appendChild(sv);})();if(SHOW_CONES){t.miradors.forEach(function(m){if(m.id!==myId||!m.tir||!m.tir.zones||!m.tir.zones.length)return;var lx=(m.gx-c.x)/c.w*100,ly=(m.gy-c.y)/c.h*100;map.appendChild(greenDisk(lx,ly));var tr=tirRenderJS(m.tir.zones);tr.bands.forEach(function(b){map.appendChild(bandDiv(lx,ly,b.start,b.width));});tr.reds.forEach(function(r){map.appendChild(coneDiv(lx,ly,{dir:r.start+r.width/2,width:r.width},'rgba(252,165,165,0.55)'));});});}t.miradors.forEach(function(m){var lx=(m.gx-c.x)/c.w*100,ly=(m.gy-c.y)/c.h*100;if(lx<-4||lx>104||ly<-4||ly>104)return;var mine=(m.id===myId);var el=document.createElement("div");el.className="marker"+(mine?" mine":"");el.style.left=lx+"%";el.style.top=ly+"%";el.style.setProperty("--c",t.color);el.innerHTML="<span class='dot'></span><span class='lbl'>"+(mine?"★ ":"")+aesc(m.label)+"</span>";map.appendChild(el);});if(t.arrows&&t.arrows.length){var W=map.offsetWidth||map.clientWidth,H=map.offsetHeight||map.clientHeight;var NS="http://www.w3.org/2000/svg";var svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 "+W+" "+H);svg.style.position="absolute";svg.style.left="0";svg.style.top="0";svg.style.width="100%";svg.style.height="100%";svg.style.pointerEvents="none";var defs=document.createElementNS(NS,"defs");svg.appendChild(defs);t.arrows.forEach(function(a,ai){var col=a.color||"#2563eb";var mkid="ah"+ai;defs.innerHTML+="<marker id='"+mkid+"' markerUnits='userSpaceOnUse' markerWidth='18' markerHeight='18' refX='13' refY='9' orient='auto'><path d='M1,1 L17,9 L1,17 Z' fill='"+col+"' stroke='#fff' stroke-width='1.5' stroke-linejoin='round'/></marker>";var x1=(a.x1-c.x)/c.w*W,y1=(a.y1-c.y)/c.h*H,x2=(a.x2-c.x)/c.w*W,y2=(a.y2-c.y)/c.h*H;function ln(color,w,mk){var l=document.createElementNS(NS,"line");l.setAttribute("x1",x1);l.setAttribute("y1",y1);l.setAttribute("x2",x2);l.setAttribute("y2",y2);l.setAttribute("stroke",color);l.setAttribute("stroke-width",w);l.setAttribute("stroke-linecap","round");if(mk)l.setAttribute("marker-end","url(#"+mkid+")");svg.appendChild(l);}ln("#fff",9,false);ln(col,5,true);});map.appendChild(svg);}(function(){var tr2=t.transport||{},moi=(me&&me.id)||"",dep2=t.deposes||[],maV2=null,vv2=t.voitures||[];for(var w1=0;w1<vv2.length;w1++){if(vv2[w1].conducteurId===moi){maV2=vv2[w1];break;}var pz2=vv2[w1].passagers||[];for(var y1=0;y1<pz2.length;y1++){if(pz2[y1].id===moi){maV2=vv2[w1];break;}}if(maV2)break;}var idDep=((tr2[moi]||{}).deposeId)||(maV2&&maV2.deposeId)||"",okDep=false;for(var i2=0;i2<dep2.length;i2++){if(dep2[i2].id===idDep)okDep=true;}var okDepart=(t.departs||[]).length>0;var mid2=myMir(index),okCone=false;(t.miradors||[]).forEach(function(m){if(m.id===mid2&&m.tir&&m.tir.zones&&m.tir.zones.length)okCone=true;});var okZone=((t.zone||[]).length>=2),okRdv=false;(function(){var mine=null,ps=(me&&me.posts)||[];for(var q2=0;q2<ps.length;q2++){if(ps[q2].traqueIndex===index){mine=ps[q2];break;}}var wanted=(mine&&mine.chefId)||"",lst=t.rdv||[];if(!wanted&&((me&&me.chefMids)||[]).length){for(var z2=0;z2<lst.length;z2++){if(me&&me.name&&lst[z2].chefName===me.name){wanted=lst[z2].chefId;break;}}}if(!wanted)return;for(var w2=0;w2<lst.length;w2++){if(lst[w2].chefId===wanted)okRdv=true;}})();function majCase(id,ok,val){var el=$(id);if(!el)return;el.disabled=!ok;el.checked=!!(ok&&val);var lb=el.parentElement;if(lb)lb.className="conetoggle"+(ok?"":" off");}majCase("deposeToggle",okDep,SHOW_DEPOSE);majCase("departToggle",okDepart,SHOW_DEPART);majCase("coneToggle",okCone,SHOW_CONES);majCase("rdvToggle",okRdv,SHOW_RDV);majCase("zoneToggle",okZone,SHOW_ZONE);})();activerZoom(map);}
function selectTraque(i){["tabs","mapTabs","postTabs"].forEach(function(id){var c=$(id);if(!c)return;var ks=c.children;for(var k=0;k<ks.length;k++)ks[k].classList.toggle("active",k===i);});renderMap(i);renderPostInfo(i);setHeroFor(i);}
function buildTabs(def){["tabs","mapTabs","postTabs"].forEach(function(id){var tabs=$(id);if(!tabs)return;tabs.innerHTML="";DATA.traques.forEach(function(t,i){var b=document.createElement("button");b.className="tab"+(i===def?" active":"");b.textContent=t.name+(myMir(i)?" ★":(monRabat(i)?" 🟠":""));b.onclick=function(){selectTraque(i);};tabs.appendChild(b);});});renderMap(def);renderPostInfo(def);setHeroFor(def);}
function setHeroFor(index){if(!me||!me.posts)return;var pp=null;for(var i=0;i<me.posts.length;i++){if(me.posts[i].traqueIndex===index){pp=me.posts[i];break;}}var mt=$("myTraque"),mp=$("myPost");if(mt)mt.textContent=DATA.traques[index]?DATA.traques[index].name:"—";if(mp)mp.textContent=pp?pp.label:(monRabat(index)?"🟠 Tu rabats":"— pas de poste sur cette traque");}
function aesc(x){return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}



/* ---- Fragment de ligne : ma voiture, a la suite du chef de ligne ---- */
function monTrajet(pp){
  if(typeof me==="undefined"||!me||!pp)return "";
  var t=(DATA.traques||[])[pp.traqueIndex];
  if(!t)return "";
  var tr=(t.transport||{})[me.id]||{},vs=t.voitures||[],maV=null,jeC=null;
  for(var a=0;a<vs.length;a++){
    var ps=vs[a].passagers||[];
    for(var b=0;b<ps.length;b++){if(ps[b].id===me.id)maV=vs[a];}
    if(vs[a].conducteurId===me.id)jeC=vs[a];
  }
  if(!maV&&!jeC)return "";
  var np=nomDe(t.deposes,tr.deposeId)||nomDe(t.deposes,((maV||jeC)||{}).deposeId),nd=nomDe(t.departs,tr.departId);
  var maVo=jeC||maV,qui=jeC?"Tu conduis":aesc(maV.conducteur);
  if(maVo&&maVo.vehicule)qui+=" ("+aesc(maVo.vehicule)+")";
  var h=" <span style='color:#7c2d12;font-weight:600'>\u00b7 \u{1F697} "+aesc(qui);
  if(np)h+=" \u2192 "+aesc(np);
  h+="</span>";
  if(nd)h+=" <span style='color:#166534;font-weight:600'>\u00b7 \u{1F6A9} "+aesc(nd)+"</span>";
  return h;
}

/* ---- Ta voiture : conducteur, point de depose, compagnons de route ---- */
function nomDe(liste,id){var l=liste||[];for(var i=0;i<l.length;i++){if(l[i].id===id)return l[i].nom;}return "";}
function remplirVoiture(myId){
  var box=document.getElementById("voitureBox"),card=document.getElementById("tileVoiture");
  if(!box||!card){return;}
  card.style.display="none";box.innerHTML="";
  if(!myId){return;}
  var h="";
  (DATA.traques||[]).forEach(function(t){
    var tr=(t.transport||{})[myId]||{},vs=t.voitures||[],maV=null,jeC=null;
    for(var a=0;a<vs.length;a++){
      var ps=vs[a].passagers||[];
      for(var b=0;b<ps.length;b++){if(ps[b].id===myId)maV=vs[a];}
      if(vs[a].conducteurId===myId)jeC=vs[a];
    }
    if(!maV&&!jeC)return;
    h+="<div style='border-top:1px solid var(--stone-200);margin-top:10px;padding-top:9px'>";
    h+="<p style='font-size:11px;color:var(--stone-400);margin:0 0 2px'>"+aesc(t.name)+"</p>";
    h+="<p style='font-family:Georgia,serif;font-size:18px;margin:0 0 3px'>\u{1F697} "+aesc(jeC?"Tu conduis":maV.conducteur)+"</p>";
    if(jeC){
      var tt=t.transport||{};
      var ps2=jeC.passagers||[];
      if(ps2.length){
        h+="<p style='font-size:11px;color:var(--stone-400);margin:4px 0 2px'>Tes passagers</p><ul style='margin:0;padding-left:18px;font-size:14px'>";
        for(var n=0;n<ps2.length;n++){
          var np2=nomDe(t.deposes,(tt[ps2[n].id]||{}).deposeId||jeC.deposeId);
          h+="<li>"+aesc(ps2[n].nom)+(np2?" &mdash; <b>"+aesc(np2)+"</b>":"")+"</li>";
        }
        h+="</ul>";
      }else{h+="<p style='font-size:14px;color:var(--stone-500);margin:0'>Aucun passager.</p>";}
    }else{
      var np=nomDe(t.deposes,tr.deposeId||maV.deposeId);
      if(np)h+="<p style='font-size:14px;color:var(--stone-700);margin:0'>Il te depose a <b>"+aesc(np)+"</b></p>";
      var autres=(maV.passagers||[]).filter(function(x){return x.id!==myId;}).map(function(x){return x.nom;});
      if(autres.length)h+="<p style='font-size:13px;color:var(--stone-500);margin:5px 0 0'>Avec toi : "+aesc(autres.join(", "))+"</p>";
    }
    var nd=nomDe(t.departs,tr.departId);
    if(nd)h+="<p style='font-size:14px;color:var(--emerald);margin:5px 0 0'>\u{1F6A9} Depart : <b>"+aesc(nd)+"</b></p>";
    h+="</div>";
  });
  if(!h){return;}
  box.innerHTML=h;card.style.display="";
}

/* ---- Zoom au pincement sur une carte ---- */
function activerZoom(el){
  if(!el)return;
  /* La carte est reconstruite a chaque rendu : on remet la couche si elle a disparu. */
  var prem=el.firstElementChild;
  if(!prem||prem.className!=="zoomlayer"){
    var nc=document.createElement("div");
    nc.className="zoomlayer";
    nc.style.cssText="position:absolute;inset:0;transform-origin:0 0;will-change:transform";
    while(el.firstChild)nc.appendChild(el.firstChild);
    el.appendChild(nc);
    el._z={z:1,tx:0,ty:0};
  }
  el.style.touchAction="none";
  function etat(){if(!el._z)el._z={z:1,tx:0,ty:0};return el._z;}
  function couche(){var c=el.firstElementChild;return (c&&c.className==="zoomlayer")?c:null;}
  function appliquer(){var s=etat(),c=couche();
    if(c)c.style.transform="translate("+s.tx+"px,"+s.ty+"px) scale("+s.z+")";
    var b=el.querySelector(".zoom-reset");if(b)b.style.display=s.z>1.02?"block":"none";}
  if(!el.querySelector(".zoom-reset")){
    var b2=document.createElement("button");b2.className="zoom-reset";
    b2.textContent="Vue d ensemble";
    b2.style.cssText="position:absolute;right:8px;bottom:8px;z-index:5;display:none;border:0;border-radius:8px;padding:7px 11px;font-size:12px;font-weight:600;background:rgba(28,25,23,.85);color:#fafaf9";
    b2.addEventListener("click",function(ev){ev.stopPropagation();el._z={z:1,tx:0,ty:0};appliquer();});
    el.appendChild(b2);
  }
  appliquer();
  if(el.dataset.zoomPret)return;el.dataset.zoomPret="1";
  var doigts=new Map(),p0=null;
  function borner(r){var s=etat();var mnX=r.width-r.width*s.z,mnY=r.height-r.height*s.z;
    s.tx=Math.max(mnX,Math.min(0,s.tx));s.ty=Math.max(mnY,Math.min(0,s.ty));}
  el.addEventListener("pointerdown",function(e){doigts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(doigts.size===2){var v=Array.from(doigts.values()),s=etat();
      p0={d:Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)||1,mx:(v[0].x+v[1].x)/2,my:(v[0].y+v[1].y)/2,z:s.z,tx:s.tx,ty:s.ty};}});
  el.addEventListener("pointermove",function(e){if(!doigts.has(e.pointerId))return;
    doigts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(doigts.size<2||!p0)return;e.preventDefault();
    var v=Array.from(doigts.values()),s=etat();
    var d=Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)||1;
    var mx=(v[0].x+v[1].x)/2,my=(v[0].y+v[1].y)/2;
    var r=el.getBoundingClientRect();
    s.z=Math.max(1,Math.min(6,p0.z*(d/p0.d)));
    s.tx=mx-r.left-((p0.mx-r.left-p0.tx)/p0.z)*s.z;
    s.ty=my-r.top-((p0.my-r.top-p0.ty)/p0.z)*s.z;
    borner(r);appliquer();},{passive:false});
  el.addEventListener("dblclick",function(e){var s=etat();var r=el.getBoundingClientRect();
    if(s.z>1.02){el._z={z:1,tx:0,ty:0};}else{
      var nz=2.5,mx=e.clientX-r.left,my=e.clientY-r.top;
      s.z=nz;s.tx=mx-(mx-s.tx)/1*nz;s.ty=my-(my-s.ty)/1*nz;borner(r);}
    appliquer();});
  function fin(e){doigts.delete(e.pointerId);if(doigts.size<2)p0=null;}
  el.addEventListener("pointerup",fin);el.addEventListener("pointercancel",fin);
}
/* ===================== La Course du Sanglier ===================== */
var JEU = null;
function jeuLS(k, v) {
  try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
}
function jeuFacteur() { return String(DATA.fnUrl || "").replace(/\\/+$/, ""); }

function openJeu() {
  openSheet("jeu");
  var pseudo = jeuLS("cdc_pseudo");
  if (pseudo) { jeuStart(pseudo); } else {
    document.getElementById("jeuPseudoBox").style.display = "block";
    document.getElementById("jeuBox").style.display = "none";
  }
  jeuLoadTop();
  jeuFlush();
}
function jeuChangePseudo() {
  document.getElementById("jeuPseudoBox").style.display = "block";
  document.getElementById("jeuPseudo").value = jeuLS("cdc_pseudo") || "";
}
function jeuSetPseudo() {
  var v = (document.getElementById("jeuPseudo").value || "").trim().slice(0, 14);
  var err = document.getElementById("jeuPseudoErr");
  if (v.length < 2) { err.textContent = "Deux caractères minimum."; err.style.display = "block"; return; }
  err.style.display = "none";
  jeuLS("cdc_pseudo", v);
  document.getElementById("jeuPseudoBox").style.display = "none";
  jeuStart(v);
}

/* --- classement --- */
function jeuLoadTop() {
  var ol = document.getElementById("jeuTop");
  fetch(jeuFacteur() + "/scores").then(function (r) { return r.json(); }).then(function (d) {
    var t = (d && d.top) || [];
    if (!t.length) { ol.innerHTML = '<li style="color:#a8a29e">Personne pour l&rsquo;instant — à toi de jouer.</li>'; return; }
    ol.innerHTML = t.map(function (e) {
      var nom = String(e.p).replace(/[<>&]/g, "");
      return '<li><b>' + nom + '</b> — ' + e.s + ' m</li>';
    }).join("");
  }).catch(function () {
    ol.innerHTML = '<li style="color:#a8a29e">Classement indisponible hors réseau.</li>';
  });
}

/* File d'attente : sans réseau, le score part plus tard. */
function jeuQueue(score) {
  var q = [];
  try { q = JSON.parse(jeuLS("cdc_scoreq") || "[]"); } catch (e) { q = []; }
  q.push(score); if (q.length > 20) q = q.slice(-20);
  jeuLS("cdc_scoreq", JSON.stringify(q));
  jeuSyncTxt("Score gardé de côté — il partira au retour du réseau.");
}
function jeuSyncTxt(m) { var el = document.getElementById("jeuSync"); if (el) el.textContent = m || ""; }

function jeuSend(score) {
  var pseudo = jeuLS("cdc_pseudo");
  if (!pseudo) return;
  fetch(jeuFacteur() + "/score", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo: pseudo, score: score })
  }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
    .then(function (res) {
      if (!res.ok) {
        if (res.d && res.d.reason === "refuse") { jeuSyncTxt("Ce pseudo a été refusé. Touche « changer » pour en choisir un autre."); return; }
        jeuQueue(score); return;
      }
      jeuSyncTxt(res.d.rank ? "Tu es " + res.d.rank + (res.d.rank === 1 ? "er" : "e") + " au classement." : "");
      if (res.d.top) {
        document.getElementById("jeuTop").innerHTML = res.d.top.map(function (e) {
          return '<li><b>' + String(e.p).replace(/[<>&]/g, "") + '</b> — ' + e.s + ' m</li>';
        }).join("");
      }
    }).catch(function () { jeuQueue(score); });
}

function jeuFlush() {
  var q = [];
  try { q = JSON.parse(jeuLS("cdc_scoreq") || "[]"); } catch (e) { return; }
  if (!q.length || !jeuLS("cdc_pseudo")) return;
  var best = Math.max.apply(null, q);
  fetch(jeuFacteur() + "/score", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo: jeuLS("cdc_pseudo"), score: best })
  }).then(function (r) { if (r.ok) { jeuLS("cdc_scoreq", "[]"); jeuSyncTxt("Scores en attente envoyés."); jeuLoadTop(); } }).catch(function () {});
}
window.addEventListener("online", jeuFlush);

/* --- moteur --- */
function jeuStart(pseudo) {
  document.getElementById("jeuBox").style.display = "block";
  document.getElementById("jeuMoi").textContent = pseudo;
  var best = Number(jeuLS("cdc_best") || 0);
  document.getElementById("jeuBest").textContent = best;
  if (JEU) return;                       // moteur déjà lancé

  var cv = document.getElementById("jeuCv"), ctx = cv.getContext("2d");
  var W = 800, H = 300, GROUND = 232, GRAV = 0.62, JUMP = -13.2;
  var AIR = (2 * Math.abs(JUMP)) / GRAV;
  var elS = document.getElementById("jeuScore"), elBar = document.getElementById("jeuDogBar"), elDog = document.getElementById("jeuDogTxt");
  var st;

  function reset() {
    st = { mode: "ready", x: 0, speed: 5.2, y: GROUND, vy: 0, onGround: true,
           obs: [], spawnIn: 90, dist: 0, diff: 0, faults: 0, dogPush: 0, t: 0, shake: 0 };
  }
  reset();
  JEU = { reset: reset };

  function act() {
    if (st.mode === "ready") { st.mode = "run"; return; }
    if (st.mode === "over") { reset(); st.mode = "run"; return; }
    if (st.onGround) { st.vy = JUMP; st.onGround = false; }
  }
  cv.addEventListener("pointerdown", function (e) { e.preventDefault(); act(); });

  function spawn() {
    var d = st.diff, r = Math.random();
    if (r < 0.56) {
      var n = 1;
      if (st.dist > 380 && Math.random() < 0.20 + d * 0.22) n = 2;
      if (st.dist > 900 && Math.random() < 0.10 + d * 0.14) n = 3;
      var ox = W + 40;
      for (var k = 0; k < n; k++) {
        var h = (24 + d * 13) + Math.random() * (13 + d * 7);
        var w = (22 + d * 7) + Math.random() * (14 + d * 5);
        st.obs.push({ type: "ronce", x: ox, w: w, h: h }); ox += w - 2;
      }
    } else {
      st.obs.push({ type: "fosse", x: W + 40, w: (44 + d * 20) + Math.random() * (32 + d * 22), h: 0 });
    }
    st.spawnIn = AIR * Math.max(1.0, (1.12 - d * 0.3) + Math.random() * (1.35 - d * 0.5));
    if (st.dist > 250 && Math.random() < 0.15 + d * 0.2) st.spawnIn = AIR * (0.95 + Math.random() * 0.08);
  }

  function boar(x, y, t, running) {
    ctx.save(); ctx.translate(x, y);
    ctx.translate(0, running ? Math.sin(t * 1.04) * 1.1 : 0);
    var D = "#292524", B = "#3f3f46", F = "#57534e";
    function leg(hx, phase, col, top) {
      var a = Math.sin(t * 0.52 + phase) * 10;
      ctx.strokeStyle = col; ctx.lineCap = "round";
      ctx.lineWidth = 7.2; ctx.beginPath(); ctx.moveTo(hx, top); ctx.lineTo(hx + 1 + a * 0.32, top + 10); ctx.stroke();
      ctx.lineWidth = 4.7; ctx.beginPath(); ctx.moveTo(hx + 1 + a * 0.32, top + 10); ctx.lineTo(hx + a * 0.82, -1); ctx.stroke();
      ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(hx + a * 0.82, -1.6); ctx.lineTo(hx + a * 0.82 + 1.5, 0); ctx.stroke();
    }
    leg(-19, 0, F, -20); leg(11, Math.PI, F, -22);
    ctx.strokeStyle = D; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-31, -34); ctx.quadraticCurveTo(-36, -28, -34, -19); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-34, -19); ctx.lineTo(-33.5, -15); ctx.stroke();
    ctx.fillStyle = B; ctx.beginPath();
    ctx.moveTo(-30, -36);
    ctx.quadraticCurveTo(-26, -42, -14, -45); ctx.quadraticCurveTo(-2, -49, 8, -52);
    ctx.quadraticCurveTo(15, -53, 21, -50); ctx.quadraticCurveTo(29, -47, 35, -40);
    ctx.quadraticCurveTo(41, -35, 46, -31); ctx.quadraticCurveTo(50, -29, 50.5, -25.5);
    ctx.quadraticCurveTo(50, -22, 46, -21.5); ctx.quadraticCurveTo(41, -21, 36, -22.5);
    ctx.quadraticCurveTo(30, -21, 25, -21); ctx.quadraticCurveTo(20, -20, 15, -20.5);
    ctx.quadraticCurveTo(8, -19, 2, -18); ctx.quadraticCurveTo(-8, -16.5, -16, -18);
    ctx.quadraticCurveTo(-24, -20, -28, -26); ctx.quadraticCurveTo(-31, -31, -30, -36);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = D; ctx.beginPath();
    var pts = [[-26,-40],[-20,-43],[-13,-45],[-6,-47],[1,-49],[8,-51],[15,-52],[20,-50]];
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 0; i < pts.length; i++) { ctx.lineTo(pts[i][0] + 1.5, pts[i][1] - 6.5 - (i % 2) * 2.5); ctx.lineTo(pts[i][0] + 3.4, pts[i][1] - 0.5); }
    for (var j = pts.length - 1; j >= 0; j--) ctx.lineTo(pts[j][0] + 2, pts[j][1] + 2);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(19, -47); ctx.quadraticCurveTo(20, -56, 26, -55); ctx.quadraticCurveTo(28, -50, 25, -44); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#faf9f7"; ctx.beginPath(); ctx.ellipse(30, -43, 2.1, 1.6, -0.35, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = D; ctx.beginPath(); ctx.arc(30.4, -43, 1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#faf9f7"; ctx.lineWidth = 2.3;
    ctx.beginPath(); ctx.moveTo(41, -22.5); ctx.quadraticCurveTo(44, -26, 42.5, -29.5); ctx.stroke();
    ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(36, -22.8); ctx.quadraticCurveTo(38, -25, 37, -27); ctx.stroke();
    ctx.fillStyle = D; ctx.beginPath(); ctx.arc(48.4, -24.6, 1.1, 0, Math.PI * 2); ctx.fill();
    leg(-14, Math.PI, B, -20); leg(16, 0, B, -22);
    ctx.restore();
  }

  function dog(x, y, t, i) {
    ctx.save(); ctx.translate(x, y);
    var sw = Math.sin(t * 0.6 + i) * 6;
    ctx.strokeStyle = "#57534e"; ctx.lineWidth = 3.4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-8, -9); ctx.lineTo(-10 + sw, 0); ctx.moveTo(6, -9); ctx.lineTo(8 - sw, 0); ctx.stroke();
    ctx.fillStyle = "#78716c";
    ctx.beginPath(); ctx.ellipse(0, -16, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(14, -21, 7, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#57534e"; ctx.beginPath(); ctx.moveTo(11, -26); ctx.lineTo(15, -32); ctx.lineTo(17, -24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#78716c"; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.moveTo(-13, -19); ctx.quadraticCurveTo(-21, -24, -18, -30); ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (st.shake > 0) ctx.translate((Math.random() - .5) * st.shake, (Math.random() - .5) * st.shake);
    ctx.fillStyle = "#f5f5f4"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#e7e5e4";
    for (var k = 0; k < 9; k++) {
      var tx = ((k * 150 - st.x * 0.25) % (W + 220)) - 110;
      ctx.beginPath(); ctx.moveTo(tx, GROUND - 6); ctx.lineTo(tx + 26, GROUND - 74); ctx.lineTo(tx + 52, GROUND - 6); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = "#a8a29e"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
    ctx.strokeStyle = "#d6d3d1"; ctx.lineWidth = 1.5;
    for (var g = 0; g < 26; g++) {
      var gx = ((g * 62 - st.x * 0.85) % (W + 70)) - 35;
      ctx.beginPath(); ctx.moveTo(gx, GROUND + 9); ctx.lineTo(gx + 22, GROUND + 9); ctx.stroke();
    }
    for (var i = 0; i < st.obs.length; i++) {
      var o = st.obs[i];
      if (o.type === "ronce") {
        ctx.save(); ctx.translate(o.x, GROUND);
        ctx.fillStyle = "#14532d"; ctx.beginPath();
        ctx.ellipse(o.w / 2, -o.h * 0.45, o.w * 0.62, o.h * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#166534"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
        for (var q = 0; q < 6; q++) {
          var px = 3 + (o.w - 6) * (q / 5);
          ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px + (q % 2 ? 4 : -4), -o.h); ctx.stroke();
        }
        ctx.restore();
      } else {
        ctx.fillStyle = "#292524"; ctx.beginPath();
        ctx.moveTo(o.x, GROUND); ctx.lineTo(o.x + 5, GROUND + 26);
        ctx.lineTo(o.x + o.w - 5, GROUND + 26); ctx.lineTo(o.x + o.w, GROUND);
        ctx.closePath(); ctx.fill();
      }
    }
    if (st.mode !== "ready") { var dx = -30 + st.dogPush * 62; for (var d2 = 0; d2 < 3; d2++) dog(dx - d2 * 34, GROUND, st.t, d2); }
    boar(120, st.y, st.t, st.mode === "run");
    ctx.restore();
    ctx.textAlign = "center";
    if (st.mode === "ready") {
      ctx.fillStyle = "rgba(28,25,23,.06)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#1c1917"; ctx.font = "600 26px -apple-system,sans-serif";
      ctx.fillText("Touche pour partir", W / 2, 110);
      ctx.fillStyle = "#78716c"; ctx.font = "15px -apple-system,sans-serif";
      ctx.fillText("Saute les ronces et les fosses", W / 2, 140);
    }
    if (st.mode === "over") {
      ctx.fillStyle = "rgba(28,25,23,.62)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fafaf9"; ctx.font = "600 30px -apple-system,sans-serif";
      ctx.fillText("Les chiens t\u2019ont rattrap\u00e9", W / 2, 118);
      ctx.font = "18px -apple-system,sans-serif";
      ctx.fillText(Math.floor(st.dist) + " m\u00e8tres parcourus", W / 2, 152);
      ctx.fillStyle = "#a8a29e"; ctx.font = "14px -apple-system,sans-serif";
      ctx.fillText("Touche pour repartir", W / 2, 184);
    }
    ctx.textAlign = "left";
  }

  function hit() {
    st.faults++; st.dogPush = st.faults; st.shake = 12;
    if (st.faults >= 2) {
      st.mode = "over";
      var d = Math.floor(st.dist);
      var b = Number(jeuLS("cdc_best") || 0);
      if (d > b) { jeuLS("cdc_best", String(d)); document.getElementById("jeuBest").textContent = d; }
      if (d > 0) jeuSend(d);
    }
  }

  function step() {
    st.t++;
    if (st.shake > 0) st.shake *= 0.86;
    if (st.mode === "run") {
      st.speed = Math.min(16.2, 5.2 + st.dist / 110);
      st.diff = Math.min(1, st.dist / 700);
      st.x += st.speed; st.dist += st.speed / 9;
      elS.textContent = Math.floor(st.dist);
      st.vy += GRAV; st.y += st.vy;
      if (st.y >= GROUND) { st.y = GROUND; st.vy = 0; st.onGround = true; }
      if (st.dogPush > 0) st.dogPush = Math.max(0, st.dogPush - 0.0016);
      if (--st.spawnIn <= 0) spawn();
      for (var i = st.obs.length - 1; i >= 0; i--) {
        var o = st.obs[i];
        o.x -= st.speed;
        if (o.x + o.w < -60) { st.obs.splice(i, 1); continue; }
        if (o.touched) continue;
        if (!(120 + 34 > o.x && 120 - 20 < o.x + o.w)) continue;
        if (o.type === "ronce") { if (st.y > GROUND - o.h + 4) { o.touched = true; hit(); } }
        else { if (st.y >= GROUND - 2) { o.touched = true; hit(); } }
      }
      var ratio = Math.max(0, 1 - st.dogPush / 2);
      elBar.style.width = (ratio * 100) + "%";
      elBar.style.background = ratio > 0.66 ? "#166534" : ratio > 0.33 ? "#b45309" : "#b91c1c";
      elDog.textContent = ratio > 0.66 ? "à bonne distance" : ratio > 0.33 ? "ils se rapprochent" : "ils sont sur toi !";
    }
    draw();
    requestAnimationFrame(step);
  }
  step();
}
/* ================================================================ */
/* ===================== Suivi GPS en direct ===================== */
/* Chacun choisit de partager sa position ; pour voir les autres, il faut partager la sienne.
   L'accord vaut pour la journee, jusqu'a 18 h ; ensuite tout s'arrete et s'efface. */
var GPS={watch:null,last:null,sent:0,sentPos:null,poll:null,tick:null,stopT:null,idx:-1,gens:[],decal:0,err:"",envoiOk:null,bulle:-1};
function gpsCle(){return "cdc_gps_"+DATA.gpsJ;}
function gpsFin(){var d=new Date();d.setHours(18,0,0,0);return d.getTime();}
function gpsEtat(){try{var o=JSON.parse(localStorage.getItem(gpsCle())||"null");if(o&&o.exp>Date.now())return o;}catch(e){}return null;}
function gpsSauve(o){try{if(o)localStorage.setItem(gpsCle(),JSON.stringify(o));else localStorage.removeItem(gpsCle());}catch(e){}}
function gpsId(){var a="abcdefghijkmnopqrstuvwxyz23456789",s="";for(var i=0;i<18;i++)s+=a.charAt(Math.floor(Math.random()*a.length));return s;}
function gpsMerc(lat,lon){var R=6378137;return {x:R*lon*Math.PI/180,y:R*Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))};}
function gpsDist(a,b){var R=6371000,dl=(b.lat-a.lat)*Math.PI/180,dn=(b.lon-a.lon)*Math.PI/180;var x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dn/2)*Math.sin(dn/2);return 2*R*Math.asin(Math.sqrt(x));}
function gpsAge(ms){var s=Math.max(0,Math.round(ms/1000));return s<60?("il y a "+s+" s"):("il y a "+Math.round(s/60)+" min");}
function gpsInit(){if(!DATA.gps||!DATA.gpsJ||!DATA.gpsUrl)return;var t=$("gpsTile");if(t)t.style.display="";var o=gpsEtat();if(o)gpsDemarrer(o);}
function openGps(){openSheet("gps");gpsRendre();gpsLancerPoll();}
function gpsMsg(m){var e=$("gpsMsg");if(e)e.textContent=m;}
function gpsPartager(){
  if(Date.now()>=gpsFin()){gpsMsg("Le suivi est terminé pour aujourd'hui (après 18 h).");return;}
  if(!navigator.geolocation){gpsMsg("Ce téléphone ne donne pas sa position.");return;}
  var nom=me?nomPublic():"",role=me?"c":"r";
  if(!me){var s=$("gpsQui");nom=s?String(s.value||"").trim():"";if(!nom){gpsMsg("Choisis d'abord ton nom.");return;}}
  var o={q:gpsId(),nom:nom,role:role,exp:gpsFin()};gpsSauve(o);gpsDemarrer(o);gpsRendre();gpsLancerPoll();
}
function gpsDemarrer(o){
  if(GPS.watch!==null||!navigator.geolocation)return;
  GPS.watch=navigator.geolocation.watchPosition(function(p){GPS.err="";GPS.last={lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy||0,t:Date.now()};gpsEnvoyer(false);gpsMajEtat();},function(e){GPS.err=(e&&e.code===1)?"refus":"indispo";gpsMajEtat();},{enableHighAccuracy:true,maximumAge:10000,timeout:30000});
  clearTimeout(GPS.stopT);GPS.stopT=setTimeout(function(){gpsArreter();},Math.max(1000,o.exp-Date.now()));
  if(!GPS.tick)GPS.tick=setInterval(function(){gpsEnvoyer(false);gpsMajEtat();},10000);
}
function gpsEnvoyer(force){
  var o=gpsEtat();if(!o||!GPS.last)return;var now=Date.now();
  var bouge=GPS.sentPos?gpsDist(GPS.sentPos,GPS.last):999;
  if(!force&&GPS.sent&&now-GPS.sent<20000&&!(bouge>15&&now-GPS.sent>6000))return;
  var premier=!GPS.sent;GPS.sent=now;GPS.sentPos=GPS.last;
  fetch(DATA.gpsUrl+"/pos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({j:DATA.gpsJ,q:o.q,n:o.nom,r:o.role,lat:GPS.last.lat,lon:GPS.last.lon,acc:Math.round(GPS.last.acc),exp:o.exp})})
    .then(function(r){GPS.envoiOk=r.ok;gpsMajEtat();if(premier)gpsCharger();}).catch(function(){GPS.envoiOk=false;gpsMajEtat();});
}
function gpsArreter(){
  var o=gpsEtat();
  if(GPS.watch!==null){try{navigator.geolocation.clearWatch(GPS.watch);}catch(e){}GPS.watch=null;}
  clearInterval(GPS.tick);GPS.tick=null;clearTimeout(GPS.stopT);clearInterval(GPS.poll);GPS.poll=null;
  if(o){try{fetch(DATA.gpsUrl+"/stop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({j:DATA.gpsJ,q:o.q}),keepalive:true}).catch(function(){});}catch(e){}}
  gpsSauve(null);GPS.last=null;GPS.sent=0;GPS.sentPos=null;GPS.gens=[];GPS.envoiOk=null;gpsRendre();
}
function gpsOuvert(){var sh=$("sheet-gps");return !!(sh&&sh.classList.contains("open"));}
function gpsLancerPoll(){clearInterval(GPS.poll);gpsCharger();GPS.poll=setInterval(function(){if(!gpsOuvert()){clearInterval(GPS.poll);GPS.poll=null;return;}gpsCharger();gpsMajEtat();},20000);}
function gpsCharger(){
  var o=gpsEtat();if(!o)return;
  fetch(DATA.gpsUrl+"/liste?j="+encodeURIComponent(DATA.gpsJ)+"&q="+encodeURIComponent(o.q),{cache:"no-store"})
    .then(function(r){return r.json();}).then(function(d){if(d&&d.ok){GPS.gens=d.gens||[];GPS.decal=Date.now()-(d.now||Date.now());gpsCarte();}}).catch(function(){});
}
function gpsIdx(){if(GPS.idx>=0&&GPS.idx<DATA.traques.length)return GPS.idx;if(me&&me.posts&&me.posts.length)return me.posts[0].traqueIndex;return 0;}
function gpsMajEtat(){
  var e=$("gpsEtat");if(!e)return;var t;
  if(GPS.err==="refus")t="Le téléphone refuse de donner ta position. Autorise la localisation pour ce site (iPhone : Réglages › Safari › Position), puis rouvre cette page.";
  else if(GPS.err==="indispo"&&!GPS.last)t="Position introuvable pour l'instant (pas de signal GPS ?). Nouvel essai en cours…";
  else if(!GPS.last)t="Recherche de ta position…";
  else t="Ta position est partagée jusqu'à 18 h · mise à jour "+gpsAge(Date.now()-GPS.last.t)+" · précision ± "+Math.round(GPS.last.acc)+" m"+(GPS.envoiOk===false?"<br><b>⚠ Envoi impossible pour le moment (réseau).</b>":"")+"<br><span style='color:#475569'>Garde cette page ouverte : écran éteint, ta position n'est plus mise à jour.</span>";
  e.innerHTML=t;
}
function gpsRendre(){
  var box=$("gpsBody");if(!box)return;var o=gpsEtat();
  if(!o){
    var h="<div class='hownote'>Pour voir où sont les chasseurs et les traqueurs, partage d'abord ta position.<ul class='gpsul'><li>Visible seulement par les participants de cette journée.</li><li>Valable aujourd'hui jusqu'à 18 h, puis arrêtée et effacée automatiquement.</li><li>Mise à jour tant que cette page reste ouverte, écran allumé.</li><li>Tu peux arrêter à tout moment.</li></ul></div>";
    if(!me){h+="<label class='gpslab'>Qui es-tu ?</label><select id='gpsQui' class='gpssel'><option value=''>Choisis ton nom</option>"+(DATA.rabatteurs||[]).map(function(n){return "<option>"+aesc(n)+"</option>";}).join("")+"</select>";}
    h+=Date.now()>=gpsFin()?"<p class='gpswarn'>Le suivi est terminé pour aujourd'hui (après 18 h).</p>":"<button class='gpsgo' onclick='gpsPartager()'>📍 Partager ma position jusqu'à 18 h</button>";
    h+="<p class='gpsmsg' id='gpsMsg'></p>";
    box.innerHTML=h;return;
  }
  var i0=gpsIdx(),tabs="";
  DATA.traques.forEach(function(t,i){tabs+="<button class='tab"+(i===i0?" active":"")+"' onclick='GPS.idx="+i+";gpsRendre()'>"+aesc(t.name)+"</button>";});
  box.innerHTML="<div class='gpsetat' id='gpsEtat'></div><div class='tabs' style='margin:10px 0'>"+tabs+"</div><div class='map' id='gpsMap'></div><p class='gpshors' id='gpsHors'></p>"
    +"<div class='gpsleg'><span><i class='gpsm'></i>Chasseur</span><span><i class='gpsm rab'></i>Traqueur</span><span><i class='gpsm moi'></i>Toi</span><span style='opacity:.5'><i class='gpsm'></i>Position de plus de 5 min</span></div>"
    +"<div class='gpswarn'>⚠️ Positions <b>indicatives</b> (GPS à 5–20 m près, avec du retard). Ne t'en sers <b>jamais</b> pour décider d'un tir.</div>"
    +"<button class='gpsstop' onclick='gpsArreter()'>Arrêter le partage</button>";
  gpsMajEtat();gpsCarte();
}
function gpsCarte(){
  var map=$("gpsMap");if(!map)return;var ti=gpsIdx();var t=DATA.traques[ti];if(!t)return;var c=t.crop;
  map.style.paddingBottom=((c.h/c.w)/arDe(t)*100)+"%";map.innerHTML="";
  var bg=document.createElement("div");bg.className="map-bg";var fw=c.w/100,fh=c.h/100,fx=c.x/100,fy=c.y/100;
  bg.style.backgroundImage="url('"+imgDe(t)+"')";bg.style.backgroundSize=(100/fw)+"% "+(100/fh)+"%";bg.style.backgroundPosition=(fw<1?fx/(1-fw)*100:0)+"% "+(fh<1?fy/(1-fh)*100:0)+"%";map.appendChild(bg);
  var mm=myMir(ti);
  (t.miradors||[]).forEach(function(m){var lx=(m.gx-c.x)/c.w*100,ly=(m.gy-c.y)/c.h*100;if(lx<-4||lx>104||ly<-4||ly>104)return;var el=document.createElement("div");el.className="marker"+(m.id===mm?" mine":"");el.style.left=lx+"%";el.style.top=ly+"%";el.style.setProperty("--c",t.color);el.innerHTML="<span class='dot' style='width:10px;height:10px'></span><span class='lbl'>"+aesc(m.label||"")+"</span>";map.appendChild(el);});
  var geo=(DATA.geo||{})[t.sec],hors=0,info=$("gpsHors");
  if(!geo){if(info)info.textContent="Cette carte n'a pas de coordonnées GPS : les positions ne peuvent pas y être placées.";activerZoom(map);return;}
  var now=Date.now()-GPS.decal;
  GPS.gens.forEach(function(g,k){
    var p=gpsMerc(g.lat,g.lon);var gx=(p.x-geo.x1)/(geo.x2-geo.x1)*100,gy=(geo.y2-p.y)/(geo.y2-geo.y1)*100;
    var lx=(gx-c.x)/c.w*100,ly=(gy-c.y)/c.h*100;
    if(lx<0||lx>100||ly<0||ly>100){hors++;return;}
    var el=document.createElement("div");var vieux=(now-g.t)>300000;
    el.className="gpsm"+(g.role==="r"?" rab":"")+(g.moi?" moi":"")+(vieux?" vieux":"");el.style.left=lx+"%";el.style.top=ly+"%";
    el.onclick=function(ev){ev.stopPropagation();GPS.bulle=k;gpsBulle(map,g,lx,ly,now);};
    map.appendChild(el);
    if(GPS.bulle===k)gpsBulle(map,g,lx,ly,now);
  });
  if(info)info.textContent=hors?(hors+" personne(s) hors de cette carte — choisis une autre traque ci-dessus."):"";
  activerZoom(map);
}
function gpsBulle(map,g,lx,ly,now){
  var b=map.querySelector(".gpsbulle");if(!b){b=document.createElement("div");b.className="gpsbulle";map.appendChild(b);}
  b.innerHTML="<b>"+aesc(g.moi?"Toi":(g.nom||"?"))+"</b><br>"+(g.role==="r"?"Traqueur · ":"")+gpsAge(now-g.t)+(g.acc?" · ± "+Math.round(g.acc)+" m":"");
  b.style.left=lx+"%";b.style.top=ly+"%";
  clearTimeout(GPS.bulleT);GPS.bulleT=setTimeout(function(){GPS.bulle=-1;if(b.parentNode)b.parentNode.removeChild(b);},3500);
}
/* ---------- Chat de la journee ---------- */
var CHAT={msgs:[],dernier:0,vide:0,lu:0,poll:null,etat:"",orga:false,moi:"",sel:0,arme:"",bloques:null,envoi:false,charge:false,encore:false,init:false,bas:true,toastT:null};
function chatK(s){return "cdc_chat_"+s+"_"+DATA.chatJ;}
function chatLs(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}return null;}
var CHAT_APP=null;
function chatAleat(n){var a="abcdefghijkmnopqrstuvwxyz23456789",s="";for(var i=0;i<n;i++)s+=a.charAt(Math.floor(Math.random()*a.length));return s;}
function chatAppareil(){if(CHAT_APP)return CHAT_APP;var v=chatLs("cdc_appareil");if(!v||v.length<12){v=chatAleat(22);chatLs("cdc_appareil",v);}CHAT_APP=v;return v;}
function chatOrgCle(){return chatLs(chatK("org"));}
function prenomTirage(v){var k="cdc_prenom_"+(DATA.journeeId||DATA.date||"");try{if(v===undefined)return localStorage.getItem(k)||"";if(v)localStorage.setItem(k,v);else localStorage.removeItem(k);}catch(e){}return "";}
function nomPublic(){if(!me)return "";if(me.num){var pr=prenomTirage();return me.name+(pr?" · "+pr:"");}return me.name||"";}
function chatPrenom(){var i=$("chatPrenom");var v=i?String(i.value||"").trim().slice(0,24):"";prenomTirage(v);chatRendre();}
function chatQui(){if(me&&me.name)return {n:nomPublic(),r:"c"};var n=chatLs(chatK("nom"));if(n)return {n:n,r:"r"};if(chatOrgCle())return {n:"Organisateur",r:"c"};return null;}
function chatOuvert(){var sh=$("sheet-chat");return !!(sh&&sh.classList.contains("open"));}
function chatErr(m){var e=$("chatErr");if(e)e.textContent=m||"";}
function chatAuto(ta){ta.style.height="44px";ta.style.height=Math.min(120,Math.max(44,ta.scrollHeight+2))+"px";}
function chatPost(route,b){return fetch(DATA.chatUrl+route,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}).then(function(r){return r.json();});}
function chatInit(){
  if(!DATA.chat||!DATA.chatJ||!DATA.chatUrl)return;
  var m=String(location.hash||"").match(/org=([a-zA-Z0-9_-]+)/);
  if(m){chatLs(chatK("org"),m[1]);try{history.replaceState(null,"",location.pathname+location.search);}catch(e){}}
  var t=$("chatTile");if(t)t.style.display="";
  CHAT.lu=parseInt(chatLs(chatK("lu"))||"0",10)||0;
  chatCharger();
  setInterval(function(){if(document.hidden||chatOuvert())return;chatCharger();},30000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)chatCharger();});
}
function openChat(){
  var to=$("chatToast");if(to)to.style.display="none";
  closeSheet();openSheet("chat");CHAT.bas=true;CHAT.sel=0;CHAT.arme="";chatErr("");chatRendre();chatMarquerLu();chatBadge();chatCharger();
  clearInterval(CHAT.poll);CHAT.poll=setInterval(function(){if(!chatOuvert()){clearInterval(CHAT.poll);CHAT.poll=null;return;}if(!document.hidden)chatCharger();},5000);
}
function chatCharger(){
  if(!DATA.chat||!DATA.chatJ||!DATA.chatUrl)return;
  var q=chatQui();if(!q){if(chatOuvert())chatRendre();return;}
  if(CHAT.charge){CHAT.encore=true;return;}CHAT.charge=true;
  var k=chatOrgCle();
  var u=DATA.chatUrl+"/chat/liste?j="+encodeURIComponent(DATA.chatJ)+"&a="+encodeURIComponent(chatAppareil())+"&n="+encodeURIComponent(q.n)+"&depuis="+CHAT.dernier+(k?"&k="+encodeURIComponent(k):"");
  fetch(u,{cache:"no-store"}).then(function(r){return r.json();}).then(function(d){chatRecu(d,k);}).catch(function(){chatRecu(null,k);});
}
function chatRecu(d,k){
  CHAT.charge=false;
  var avantEtat=CHAT.etat,change=false;
  if(!d){CHAT.etat=CHAT.init?"reseau-ok":"reseau";}
  else if(!d.ok){CHAT.etat=d.reason||"erreur";if(d.reason==="bloque"){CHAT.msgs=[];CHAT.dernier=0;}change=true;}
  else{
    CHAT.etat="ok";CHAT.moi=d.moi||"";
    if(k&&!d.orga){chatLs(chatK("org"),null);}
    if(CHAT.orga!==!!d.orga){CHAT.orga=!!d.orga;change=true;}
    if((d.vide||0)>CHAT.vide){CHAT.vide=d.vide;CHAT.msgs=CHAT.msgs.filter(function(x){return x.id>d.vide;});change=true;}
    var sp={};(d.suppr||[]).forEach(function(i){sp[i]=1;});
    var n0=CHAT.msgs.length;CHAT.msgs=CHAT.msgs.filter(function(x){return !sp[x.id];});if(CHAT.msgs.length!==n0)change=true;
    var vus={};CHAT.msgs.forEach(function(x){vus[x.id]=1;});
    var nouveaux=[];
    (d.msgs||[]).forEach(function(x){if(!vus[x.id]&&!sp[x.id]&&x.id>CHAT.vide){CHAT.msgs.push(x);nouveaux.push(x);}if(x.id>CHAT.dernier)CHAT.dernier=x.id;});
    if(nouveaux.length)change=true;
    if(CHAT.msgs.length>600)CHAT.msgs=CHAT.msgs.slice(-600);
    if(CHAT.init&&nouveaux.length&&!chatOuvert()){var der=null;for(var i=nouveaux.length-1;i>=0;i--){if(nouveaux[i].aid!==CHAT.moi&&nouveaux[i].id>CHAT.lu){der=nouveaux[i];break;}}if(der)chatToast(der);}
    CHAT.init=true;
    if(chatOuvert())chatMarquerLu();
  }
  if(chatOuvert()&&(change||avantEtat!==CHAT.etat))chatRendre();
  chatBadge();
  if(CHAT.encore){CHAT.encore=false;chatCharger();}
}
function chatMarquerLu(){var m=0;CHAT.msgs.forEach(function(x){if(x.id>m)m=x.id;});if(m>CHAT.lu){CHAT.lu=m;chatLs(chatK("lu"),String(m));}}
function chatNonLus(){var n=0;CHAT.msgs.forEach(function(x){if(x.id>CHAT.lu&&x.aid!==CHAT.moi)n++;});return n;}
function chatBadge(){
  var b=$("chatBadge"),h=$("chatHint");if(!b)return;
  var n=(CHAT.etat==="ok"||CHAT.etat==="reseau-ok")?chatNonLus():0;
  b.style.display=n?"":"none";b.textContent=n>99?"99+":String(n);
  if(h)h.textContent=CHAT.etat==="bloque"?"Tu as été retiré de ce chat":(n?(n===1?"1 nouveau message":n+" nouveaux messages"):"Discute avec les chasseurs et les rabatteurs");
}
function chatToast(x){
  var t=$("chatToast");if(!t)return;
  var txt=String(x.txt||"");if(txt.length>70)txt=txt.slice(0,70)+"…";
  t.innerHTML="💬 <b>"+aesc(x.nom)+"</b> : "+aesc(txt);t.style.display="block";
  clearTimeout(CHAT.toastT);CHAT.toastT=setTimeout(function(){t.style.display="none";},6000);
}
var CHAT_JOURS=["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],CHAT_MOIS=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
function chatJour(t){var d=new Date(t),a=new Date();if(d.toDateString()===a.toDateString())return "Aujourd'hui";var h=new Date(a.getTime()-86400000);if(d.toDateString()===h.toDateString())return "Hier";return CHAT_JOURS[d.getDay()]+" "+d.getDate()+" "+CHAT_MOIS[d.getMonth()];}
function chatHeure(t){var d=new Date(t);return d.getHours()+":"+(d.getMinutes()<10?"0":"")+d.getMinutes();}
function chatTexte(s){return aesc(s).split(String.fromCharCode(10)).join("<br>");}
function chatRendre(){
  if(!chatOuvert())return;
  var info=$("chatInfo"),list=$("chatList"),form=$("chatForm"),adm=$("chatAdmin");if(!info||!list||!form)return;
  var q=chatQui();
  if(!q){
    var r=DATA.rabatteurs||[],h="<p class='chatnote'>Pour écrire et lire les messages, dis-nous qui tu es.</p><label class='gpslab'>Qui es-tu ?</label>";
    if(r.length)h+="<select id='chatQui' class='gpssel'><option value=''>Choisis ton nom</option>"+r.map(function(n){return "<option>"+aesc(n)+"</option>";}).join("")+"</select>";
    else h+="<input id='chatQui' class='gpssel' maxlength='40' placeholder='Ton prénom et ton nom'>";
    h+="<button class='rolebtn' style='background:#166534;margin-top:8px' onclick='chatChoisir()'>Entrer dans le chat</button>";
    info.innerHTML=h;list.style.display="none";form.style.display="none";if(adm)adm.innerHTML="";return;
  }
  if(CHAT.etat==="bloque"){info.innerHTML="<div class='chatorga' style='background:#fef2f2;border-color:#fecaca;color:#991b1b'>⛔ L'organisateur t'a retiré de ce chat.</div>";list.style.display="none";form.style.display="none";if(adm)adm.innerHTML="";return;}
  if(CHAT.etat==="ferme"){info.innerHTML="<p class='chatvide'>Le chat n'est pas encore ouvert pour cette journée.</p>";list.style.display="none";form.style.display="none";if(adm)adm.innerHTML="";return;}
  if(!CHAT.init&&CHAT.etat!=="reseau"){info.innerHTML="<p class='chatnote'>Chargement des messages…</p>";list.style.display="none";form.style.display="none";return;}
  var hi="";
  if(CHAT.orga)hi+="<div class='chatorga'>👑 <b>Mode organisateur</b> — touche un message pour le supprimer ou retirer la personne du chat.</div>";
  if(me&&me.num&&!prenomTirage())hi+="<p class='chatnote'>Ajoute ton prénom pour qu'on te reconnaisse (facultatif) :</p><div class='prenombox'><input id='chatPrenom' maxlength='24' placeholder='Ton prénom'><button onclick='chatPrenom()'>OK</button></div>";
  hi+="<p class='chatnote'>Tu écris en tant que <b>"+aesc(q.n)+"</b>"+((!me&&chatLs(chatK("nom")))?"<button onclick='chatChanger()'>changer</button>":"")+"</p>";
  if(CHAT.etat==="reseau"||CHAT.etat==="reseau-ok")hi+="<p class='chatnote' style='color:#b45309'>⚠ Pas de réseau pour le moment, nouvel essai automatique…</p>";
  info.innerHTML=hi;list.style.display="";form.style.display="";
  chatRendreListe();chatRendreAdmin();
}
function chatRendreListe(){
  var list=$("chatList");if(!list)return;
  var bas=CHAT.bas||(list.scrollHeight-list.scrollTop-list.clientHeight<70);
  if(!CHAT.msgs.length){list.innerHTML="<p class='chatvide'>Aucun message pour l'instant.<br>Lance la discussion !</p>";CHAT.bas=false;return;}
  var h="",jour="";
  CHAT.msgs.forEach(function(x){
    var j=chatJour(x.t);if(j!==jour){jour=j;h+="<div class='cjour'>"+j+"</div>";}
    var moi=x.aid===CHAT.moi,cls="cm"+(moi?" moi":"")+(x.o?" org":"")+(CHAT.sel===x.id?" sel":"");
    h+="<div class='"+cls+"'"+(CHAT.orga?" onclick='chatTap("+x.id+")'":"")+"><div class='cmh'>"+(moi?"Toi":((x.o&&x.nom==="Organisateur")?"":((x.role==="r"?"🥁 ":"🦌 ")+"<b>"+aesc(x.nom)+"</b>")))+(x.o?"<span class='cmorg'"+((!moi&&x.nom==="Organisateur")?" style='margin-left:0'":"")+">Organisateur</span>":"")+" · "+chatHeure(x.t)+"</div><div>"+chatTexte(x.txt)+"</div>";
    if(CHAT.orga&&CHAT.sel===x.id){
      h+="<div class='cmact'><button class='"+(CHAT.arme==="s"+x.id?"arm":"")+"' onclick='event.stopPropagation();chatAction(&quot;s&quot;,"+x.id+")'>"+(CHAT.arme==="s"+x.id?"Confirmer la suppression":"🗑 Supprimer le message")+"</button>";
      if(!moi&&!x.o)h+="<button class='"+(CHAT.arme==="b"+x.id?"arm":"")+"' onclick='event.stopPropagation();chatAction(&quot;b&quot;,"+x.id+")'>"+(CHAT.arme==="b"+x.id?"Confirmer : retirer "+aesc(x.nom):"⛔ Retirer "+aesc(x.nom)+" du chat")+"</button>";
      h+="</div>";
    }
    h+="</div>";
  });
  list.innerHTML=h;
  if(bas){list.scrollTop=list.scrollHeight;}
  CHAT.bas=false;
}
function chatRendreAdmin(){
  var adm=$("chatAdmin");if(!adm)return;
  if(!CHAT.orga){adm.innerHTML="";return;}
  var h="<div class='chatadm'><h4>⛔ Personnes retirées du chat</h4>";
  if(CHAT.bloques===null)h+="<button onclick='chatVoirBloques()'>Voir la liste</button>";
  else if(!CHAT.bloques.length)h+="<p class='chatnote'>Personne pour l'instant.</p>";
  else CHAT.bloques.forEach(function(g){h+="<div class='chatbl'><span>"+aesc(g.nom||"Sans nom")+"</span><button onclick='chatDebloquer(&quot;"+aesc(g.aid)+"&quot;)'>Réintégrer</button></div>";});
  h+="<h4 style='margin-top:14px'>🧹 Tout effacer</h4><button class='"+(CHAT.arme==="vider"?"arm":"")+"' onclick='chatVider()'>"+(CHAT.arme==="vider"?"Confirmer : effacer tous les messages":"Vider le chat de cette journée")+"</button></div>";
  adm.innerHTML=h;
}
function chatTap(id){if(!CHAT.orga)return;CHAT.sel=(CHAT.sel===id?0:id);CHAT.arme="";chatRendreListe();}
function chatChoisir(){var s=$("chatQui");var n=s?String(s.value||"").trim():"";if(!n){chatErr("Choisis d'abord ton nom.");return;}chatErr("");chatLs(chatK("nom"),n.slice(0,40));CHAT.init=false;CHAT.etat="";chatRendre();chatCharger();}
function chatChanger(){chatLs(chatK("nom"),null);chatRendre();}
function chatEnvoyer(){
  var q=chatQui(),ta=$("chatTxt"),bt=$("chatBtn");if(!q||!ta)return;
  var t=String(ta.value||"").trim();if(!t||CHAT.envoi)return;
  CHAT.envoi=true;if(bt)bt.disabled=true;chatErr("");
  var k=chatOrgCle(),b={j:DATA.chatJ,a:chatAppareil(),n:q.n,r:q.r,txt:t};if(k)b.k=k;
  chatPost("/chat/msg",b).then(function(d){
    CHAT.envoi=false;if(bt)bt.disabled=false;
    if(d&&d.ok){ta.value="";chatAuto(ta);CHAT.bas=true;chatCharger();return;}
    var r=d&&d.reason,mm={vite:"Doucement : attends une seconde entre deux messages.",bloque:"L'organisateur t'a retiré de ce chat.",plein:"Le chat de cette journée est plein.",ferme:"Le chat n'est pas encore ouvert."};
    chatErr(mm[r]||"Envoi impossible pour le moment.");
    if(r==="bloque"){CHAT.etat="bloque";CHAT.msgs=[];chatRendre();chatBadge();}
  }).catch(function(){CHAT.envoi=false;if(bt)bt.disabled=false;chatErr("Pas de réseau : ton message n'est pas parti. Réessaie.");});
}
function chatAction(type,id){
  var cle=type+id;if(CHAT.arme!==cle){CHAT.arme=cle;chatRendreListe();return;}
  CHAT.arme="";var x=null;CHAT.msgs.forEach(function(m){if(m.id===id)x=m;});if(!x)return;
  var k=chatOrgCle();
  if(type==="s"){
    CHAT.msgs=CHAT.msgs.filter(function(m){return m.id!==id;});CHAT.sel=0;chatRendreListe();
    chatPost("/chat/suppr",{j:DATA.chatJ,k:k,id:id}).then(function(d){if(!d||!d.ok)chatErr("Suppression impossible.");}).catch(function(){chatErr("Pas de réseau : la suppression n'est pas passée.");});
  }else{
    CHAT.sel=0;chatRendreListe();
    chatPost("/chat/bloque",{j:DATA.chatJ,k:k,aid:x.aid,nom:x.nom}).then(function(d){if(d&&d.ok){chatErr("");if(CHAT.bloques!==null)chatVoirBloques();else{CHAT.bloques=null;chatVoirBloques();}}else chatErr("Impossible de retirer cette personne.");}).catch(function(){chatErr("Pas de réseau : réessaie.");});
  }
}
function chatVoirBloques(){
  var k=chatOrgCle();if(!k)return;
  fetch(DATA.chatUrl+"/chat/bloques?j="+encodeURIComponent(DATA.chatJ)+"&k="+encodeURIComponent(k),{cache:"no-store"}).then(function(r){return r.json();}).then(function(d){if(d&&d.ok){CHAT.bloques=d.gens||[];chatRendreAdmin();}}).catch(function(){chatErr("Pas de réseau : réessaie.");});
}
function chatDebloquer(aid){chatPost("/chat/debloque",{j:DATA.chatJ,k:chatOrgCle(),aid:aid}).then(function(){chatVoirBloques();}).catch(function(){chatErr("Pas de réseau : réessaie.");});}
function chatVider(){
  if(CHAT.arme!=="vider"){CHAT.arme="vider";chatRendreAdmin();return;}
  CHAT.arme="";
  chatPost("/chat/vider",{j:DATA.chatJ,k:chatOrgCle()}).then(function(d){if(d&&d.ok){CHAT.msgs=[];chatRendre();chatCharger();}else chatErr("Impossible de vider le chat.");}).catch(function(){chatErr("Pas de réseau : réessaie.");});
}
var RETOUR_HELP=false;function openSheet(k){var el=document.getElementById("sheet-"+k);if(el)el.classList.add("open");if(k==="retour"&&!RETOUR_HELP){RETOUR_HELP=true;var rh=document.getElementById("retourHelp");if(rh)rh.style.display="flex";}}
function closeSheet(){var ls=document.querySelectorAll(".sheet-back");for(var i=0;i<ls.length;i++)ls[i].classList.remove("open");}
var SHOW_CONES=false;\nvar SHOW_ZONE=false;\nvar SHOW_DEPART=true;\nvar SHOW_DEPOSE=true;
var SHOW_RDV=false;
function toggleCones(v){SHOW_CONES=v;renderMap(MAP_I);}
function toggleRdv(v){SHOW_RDV=v;renderMap(MAP_I);}\nfunction toggleZone(v){SHOW_ZONE=v;renderMap(MAP_I);}\nfunction toggleDepart(v){SHOW_DEPART=v;renderMap(MAP_I);}\nfunction toggleDepose(v){SHOW_DEPOSE=v;renderMap(MAP_I);}
function renderAttribs(){var card=$("attribsCard");var box=$("attribs");if(!card||!box)return;var list=DATA.attributions||[];box.innerHTML="";if(!list.length){card.style.display="none";return;}card.style.display="block";list.forEach(function(a){var txt,bg,col;if(a.mode==="bracelets"){txt=a.count+" bracelet"+(a.count>1?"s":"");bg="#f0fdf4";col="#166534";}else if(a.mode==="interdit"){txt="Interdit";bg="#fef2f2";col="#b91c1c";}else{txt="Libre";bg="#f5f5f4";col="#57534e";}var note=a.note?(" — "+aesc(a.note)):"";var d=document.createElement("div");d.style.cssText="display:flex;justify-content:space-between;gap:10px;align-items:center;padding:9px 11px;border-radius:9px;margin-bottom:6px;font-size:14px;background:"+bg;d.innerHTML="<span style='font-weight:600;color:#1c1917'>"+aesc(a.emoji)+" "+aesc(a.label)+"</span><span style='font-weight:700;color:"+col+";text-align:right'>"+txt+note+"</span>";box.appendChild(d);});}
function renderPostInfo(index){var card=$("postInfoCard");if(!card)return;if(!me||!me.posts){card.style.display="none";return;}var post=null;for(var i=0;i<me.posts.length;i++){if(me.posts[i].traqueIndex===index){post=me.posts[i];break;}}var title=$("postInfoTitle");var cons=$("myConsigne");var ph=$("myPhotos");if(!post){if(title)title.textContent=monRabat(index)?"🟠 Tu rabats sur cette traque":"📍 Tu n'as pas de poste sur cette traque";var mc0=$("myChef");if(mc0)mc0.style.display="none";if(cons)cons.style.display="none";if(ph)ph.innerHTML="";card.style.display="block";return;}if(title)title.textContent="📍 Ton poste : "+post.label;var mc=$("myChef");if(mc){if(post.chef){mc.style.display="block";mc.textContent="👨‍✈️ Chef de ligne : "+post.chef;}else{mc.style.display="none";}}if(cons){if(post.consignes){cons.style.display="flex";var cs=cons.querySelector("span");cs.textContent=post.consignes;cs.style.whiteSpace="pre-line";}else{cons.style.display="none";}}if(ph){ph.innerHTML="";(post.photos||[]).forEach(function(src){var im=document.createElement("img");im.className="postphoto";im.src=src;im.style.display="block";im.style.marginTop="8px";ph.appendChild(im);});}card.style.display="block";}
function renderHero(){var hc=document.querySelector("#appview .hero");try{remplirVoiture(me&&me.id);}catch(e){}if(hc)hc.style.display="";var mh=document.querySelector(".maphint");if(mh)mh.textContent="Ton poste est surligné en orange · lecture seule";var p=me.posts[0];var r0=(!p&&me.rabats&&me.rabats.length)?DATA.traques[me.rabats[0]]:null;$("myTraque").textContent=p?p.traqueName:(r0?r0.name:"—");$("myPost").textContent=p?p.label:(r0?"🟠 Tu rabats":"—");$("myName").textContent="🦌 "+me.name;var hchef=$("myHeroChef");if(hchef)hchef.style.display="none";$("subapp").textContent=fmtDate(DATA.date)+" — "+DATA.territoire;var ex=$("extra");ex.innerHTML="";var lig=me.posts.map(function(pp){return {i:pp.traqueIndex,pp:pp};});(me.rabats||[]).forEach(function(ri){lig.push({i:ri,pp:null});});lig.sort(function(a,b){return a.i-b.i;});lig.forEach(function(o){var pp=o.pp;var d=document.createElement("div");d.style.cssText="margin-top:7px;font-size:15px;line-height:1.35";if(!pp){var tq=DATA.traques[o.i]||{};d.innerHTML="• <b>"+aesc(tq.name)+"</b> → <b style='color:#c2410c'>🟠 Tu rabats</b>";ex.appendChild(d);return;}d.innerHTML="• <b>"+aesc(pp.traqueName)+"</b> → "+aesc(pp.label)+(pp.chef?" <span style='color:#166534;font-weight:600'>· 👨‍✈️ "+aesc(pp.chef)+"</span>":"")+(typeof monTrajet==="function"?monTrajet(pp):"");ex.appendChild(d);});setupFeedback();renderAttribs();renderChef();}
function renderChef(){var card=$("chefCard");var box=$("chefPosts");if(!card||!box)return;var list=(me&&me.chefPosts)||[];if(!list.length){card.style.display="none";return;}card.style.display="block";box.innerHTML="";var grp={};var ord=[];list.forEach(function(pp){if(!grp[pp.traqueName]){grp[pp.traqueName]=[];ord.push(pp.traqueName);}grp[pp.traqueName].push(pp);});ord.forEach(function(tn){var h=document.createElement("div");h.textContent=tn;h.style.cssText="font-weight:700;color:#166534;margin:10px 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:.03em";box.appendChild(h);grp[tn].forEach(function(pp){var d=document.createElement("div");d.style.cssText="display:flex;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:8px;margin-bottom:4px;background:#f5f5f4;font-size:14px";d.innerHTML="<span style='font-weight:600;color:#1c1917'>"+aesc(pp.label)+"</span><span style='color:#57534e'>"+aesc(pp.hunter||"libre")+"</span>";box.appendChild(d);});});var mids=(me&&me.chefMids)||[];var tabsEl=$("chefTabs");var mapEl=$("chefMap");if(!tabsEl||!mapEl)return;tabsEl.innerHTML="";var rel=[];DATA.traques.forEach(function(t,i){if((t.placed||[]).some(function(pp){return mids.indexOf(pp.mid)>=0;}))rel.push(i);});if(!rel.length){mapEl.style.display="none";return;}mapEl.style.display="block";rel.forEach(function(idx,k){var b=document.createElement("button");b.className="tab"+(k===0?" active":"");b.textContent=DATA.traques[idx].name;b.onclick=function(){var ch=tabsEl.children;for(var j=0;j<ch.length;j++)ch[j].className="tab";b.className="tab active";renderChefMap(idx);};tabsEl.appendChild(b);});renderChefMap(rel[0]);}
var CHEF_I=0;
function renderChefMap(index){CHEF_I=index;var t=DATA.traques[index];var c=t.crop;var map=$("chefMap");if(!map)return;map.style.paddingBottom=((c.h/c.w)/arDe(t)*100)+"%";map.innerHTML="";var bg=document.createElement("div");bg.className="map-bg";var fw=c.w/100,fh=c.h/100,fx=c.x/100,fy=c.y/100;bg.style.backgroundImage="url('"+imgDe(t)+"')";bg.style.backgroundSize=(100/fw)+"% "+(100/fh)+"%";bg.style.backgroundPosition=(fw<1?fx/(1-fw)*100:0)+"% "+(fh<1?fy/(1-fh)*100:0)+"%";map.appendChild(bg);var mids=(me&&me.chefMids)||[];(t.placed||[]).forEach(function(pp){var lx=(pp.gx-c.x)/c.w*100,ly=(pp.gy-c.y)/c.h*100;if(lx<-4||lx>104||ly<-4||ly>104)return;var isChef=mids.indexOf(pp.mid)>=0;var el=document.createElement("div");el.className="marker"+(isChef?" mine":"");el.style.left=lx+"%";el.style.top=ly+"%";el.style.setProperty("--c",t.color);el.innerHTML="<span class='dot'></span><span class='lbl'>"+(isChef?"★ ":"")+aesc(pp.hunter||"")+"</span>";map.appendChild(el);});activerZoom(map);}
var FB_SENT=true, FB_B=[], FB_S=[], FB_A=[];
function fbHasData(){for(var i=0;i<FB_B.length;i++){if((FB_B[i]||0)>0)return true;if(FB_S[i])return true;var c=$("fbC"+i);if(c&&c.value)return true;if(FB_A[i]){for(var k in FB_A[i]){if(FB_A[i][k]>0)return true;}}}return false;}
window.addEventListener("beforeunload",function(e){if(!FB_SENT&&fbHasData()){e.preventDefault();e.returnValue="";return "";}});
function fbPick(idx,val){var map={"Bon":"_bon","À réparer":"_rep","Dangereux":"_dng"};FB_S[idx]=(FB_S[idx]===val?"":val);["_bon","_rep","_dng"].forEach(function(sfx){var el=$("fbP"+idx+sfx);if(el)el.className="pill";});if(FB_S[idx]){var cls=(val==="Bon"?"on-bon":val==="À réparer"?"on-rep":"on-dng");$("fbP"+idx+map[val]).className="pill "+cls;}FB_SENT=false;}
function bindCounter(inp,getV,setV,minusEl,plusEl){if(!inp)return;inp.value=getV();inp.setAttribute("inputmode","numeric");inp.onfocus=function(){inp.setAttribute("data-prev",getV());inp.value="";};inp.oninput=function(){var v=parseInt((inp.value||"").replace(/[^0-9]/g,""),10);setV(isNaN(v)?0:Math.max(0,v));FB_SENT=false;};inp.onblur=function(){if(inp.value===""){setV(Number(inp.getAttribute("data-prev"))||0);}inp.value=getV();};if(minusEl)minusEl.onclick=function(){setV(Math.max(0,getV()-1));inp.value=getV();FB_SENT=false;};if(plusEl)plusEl.onclick=function(){setV(getV()+1);inp.value=getV();FB_SENT=false;};}
function fbStoreKey(){return "battue_fb_"+DATA.journeeId+"_"+((me&&me.name)||"");}
function fbLoadSent(){try{return JSON.parse(localStorage.getItem(fbStoreKey())||"{}")||{};}catch(e){return {};}}
function fbSaveSent(o){try{localStorage.setItem(fbStoreKey(),JSON.stringify(o));}catch(e){}}
function fbGroups(){var groups=[],byId={};me.posts.forEach(function(p,idx){if(!byId[p.trackId]){byId[p.trackId]={trackId:p.trackId,name:p.traqueName,color:p.color,idxs:[]};groups.push(byId[p.trackId]);}byId[p.trackId].idxs.push(idx);});return groups;}
function fbPostInputs(idx,esp){var p=me.posts[idx];if(FB_B[idx]==null)FB_B[idx]=0;if(!FB_S[idx])FB_S[idx]="";if(!FB_A[idx])FB_A[idx]={};var prows="";esp.forEach(function(e){if(FB_A[idx][e.key]==null)FB_A[idx][e.key]=0;prows+="<div class='prow'><span class='pemo'>"+e.emoji+" "+aesc(e.label)+"</span><div class='counter sm'><button type='button' class='cbtn' id='fbAm"+idx+"_"+e.key+"'>\u2212</button><input class='cval' id='fbA"+idx+"_"+e.key+"' value='"+(FB_A[idx][e.key]||0)+"'/><button type='button' class='cbtn' id='fbAp"+idx+"_"+e.key+"'>+</button></div></div>";});return "<div class='fbpost'><p class='fbpost-t'>Poste "+aesc(p.label)+"</p><p class='fblab'>Balles tir\u00e9es</p><div class='counter'><button type='button' class='cbtn' id='fbMinus"+idx+"'>\u2212</button><input class='cval' id='fbV"+idx+"' value='"+(FB_B[idx]||0)+"'/><button type='button' class='cbtn' id='fbPlus"+idx+"'>+</button></div><p class='fblab'>Animaux pr\u00e9lev\u00e9s</p><div class='preleve'>"+prows+"</div><button type='button' class='fbmini' id='fbToggle"+idx+"'>\ud83d\udee0\ufe0f Signaler un probl\u00e8me de mirador</button><div class='fbadv' id='fbAdv"+idx+"' style='display:none'><p class='fblab'>\u00c9tat du mirador</p><div class='pills'><button type='button' class='pill' id='fbP"+idx+"_bon'>Bon</button><button type='button' class='pill' id='fbP"+idx+"_rep'>\u00c0 r\u00e9parer</button><button type='button' class='pill' id='fbP"+idx+"_dng'>Dangereux</button></div><p class='fblab'>Commentaire</p><input class='fbcom' id='fbC"+idx+"' placeholder='ex : \u00e9chelle ab\u00eem\u00e9e\u2026'/></div></div>";}
function fbWirePost(idx,esp){bindCounter($("fbV"+idx),function(){return FB_B[idx];},function(v){FB_B[idx]=v;},$("fbMinus"+idx),$("fbPlus"+idx));esp.forEach(function(e){bindCounter($("fbA"+idx+"_"+e.key),function(){return FB_A[idx][e.key];},function(v){FB_A[idx][e.key]=v;},$("fbAm"+idx+"_"+e.key),$("fbAp"+idx+"_"+e.key));});$("fbP"+idx+"_bon").onclick=function(){fbPick(idx,"Bon");};$("fbP"+idx+"_rep").onclick=function(){fbPick(idx,"\u00c0 r\u00e9parer");};$("fbP"+idx+"_dng").onclick=function(){fbPick(idx,"Dangereux");};var tg=$("fbToggle"+idx);if(tg)tg.onclick=function(){var a=$("fbAdv"+idx);if(a)a.style.display=(a.style.display==="none"?"block":"none");};if(FB_S[idx]){var mp={"Bon":"bon","\u00c0 r\u00e9parer":"rep","Dangereux":"dng"};var el=$("fbP"+idx+"_"+mp[FB_S[idx]]);if(el)el.classList.add("on");var av=$("fbAdv"+idx);if(av)av.style.display="block";}}
function renderTraqueBlock(g,esp,isSent,editing){var block=$("fbFormBody");if(!block)return;if(isSent&&!editing){block.innerHTML="<div class='fbsentrow'><span class='fbok'>\u2713 D\u00e9j\u00e0 envoy\u00e9</span><button type='button' class='fbmod' id='fbMod_"+g.trackId+"'>Modifier</button></div>";$("fbMod_"+g.trackId).onclick=function(){if(window.confirm("Tu vas modifier un retour d\u00e9j\u00e0 envoy\u00e9 pour \u00ab "+g.name+" \u00bb. Continuer ?")){renderTraqueBlock(g,esp,true,true);}};return;}var inner="";if(editing)inner+="<div class='fbwarn'>\u26a0\ufe0f Modification d'un retour d\u00e9j\u00e0 envoy\u00e9</div>";inner+="<button type='button' class='fbrien' id='fbRien_"+g.trackId+"'>\ud83d\udc4d Rien \u00e0 signaler</button>";g.idxs.forEach(function(idx){inner+=fbPostInputs(idx,esp);});inner+="<button type='button' class='fbsend' id='fbSend_"+g.trackId+"'>"+(editing?"Renvoyer cette traque":"Envoyer cette traque")+"</button><p class='fbmsg' id='fbMsg_"+g.trackId+"'></p>";block.innerHTML=inner;g.idxs.forEach(function(idx){fbWirePost(idx,esp);});$("fbSend_"+g.trackId).onclick=function(){confirmTraque(g,esp);};var rn=$("fbRien_"+g.trackId);if(rn)rn.onclick=function(){sendRien(g,esp);};}
function renderGridTile(g,isSent){var b=$("fbSq_"+g.trackId);if(!b)return;b.className="fbsq"+(isSent?" done":"");b.innerHTML="<span class='fbsqdot' style='background:"+(g.color||"#166534")+"'></span><span class='fbsqname'>"+aesc(g.name)+"</span><span class='fbsqbadge'>"+(isSent?"\u2713 Envoy\u00e9":"\u00c0 remplir")+"</span>";}
function fbOpenTraque(g,esp){var sent=fbLoadSent();var gr=$("fbGrid");if(gr)gr.style.display="none";var sa=$("fbSendAll");if(sa)sa.style.display="none";var form=$("fbForm");if(!form)return;form.style.display="block";form.innerHTML="<button type='button' class='fbback' id='fbBack'>\u2190 Retour aux traques</button><div class='fbformhd'><span class='fbdot' style='background:"+(g.color||"#166534")+"'></span>"+aesc(g.name)+"</div><div id='fbFormBody'></div>";$("fbBack").onclick=function(){fbBackToGrid();};renderTraqueBlock(g,esp,!!sent[g.trackId],false);}
function fbBackToGrid(){var form=$("fbForm");if(form){form.style.display="none";form.innerHTML="";}var gr=$("fbGrid");if(gr)gr.style.display="grid";updateSendAll();}
function updateSendAll(){var sent=fbLoadSent();var groups=fbGroups();var remaining=0;groups.forEach(function(g){if(!sent[g.trackId])remaining++;});var b=$("fbSendAll");if(!b)return;if(remaining<=1){b.style.display="none";}else{b.style.display="block";b.textContent="\ud83d\udce4 Tout envoyer ("+remaining+" traques)";}}
function setupFeedback(){var card=$("feedbackCard");var list=$("fbList");if(!card||!list)return;if(!me||!DATA.fnUrl||!DATA.journeeId||!me.posts.length){card.style.display="none";return;}card.style.display="block";FB_SENT=true;FB_B=[];FB_S=[];FB_A=[];var esp=DATA.especes||[];var sent=fbLoadSent();var groups=fbGroups();list.innerHTML="<div id='fbGrid' class='fbgrid'></div><button class='fbsendall' id='fbSendAll' type='button'>\ud83d\udce4 Tout envoyer</button><div id='fbForm' class='fbform' style='display:none'></div>";var gr=$("fbGrid");groups.forEach(function(g){var b=document.createElement("button");b.type="button";b.className="fbsq";b.id="fbSq_"+g.trackId;gr.appendChild(b);renderGridTile(g,!!sent[g.trackId]);b.onclick=function(){fbOpenTraque(g,esp);};});var sa=$("fbSendAll");if(sa)sa.onclick=function(){sendAll(esp);};updateSendAll();}
function fbAnimalsText(idx){var esp=DATA.especes||[];var parts=[];esp.forEach(function(e){var q=(FB_A[idx]&&FB_A[idx][e.key])||0;if(q>0)parts.push(q+" "+e.label);});return parts.join(", ");}
function confirmTraque(g,esp){var esp0=DATA.especes||[];var bad=null,badB=0,badA=0;for(var qi=0;qi<g.idxs.length;qi++){var ix=g.idxs[qi];var tot=0;esp0.forEach(function(e){tot+=(FB_A[ix]&&FB_A[ix][e.key])||0;});if((FB_B[ix]||0)<tot){bad=me.posts[ix];badB=FB_B[ix]||0;badA=tot;break;}}var warnHtml=bad?("<div class='fbwarnov'>\u26a0\ufe0f Poste "+aesc(bad.label)+" : "+badB+" balle(s) pour "+badA+" animal(aux). V\u00e9rifie \u2014 tu peux quand m\u00eame envoyer.</div>"):"";var recaps=g.idxs.map(function(idx){var p=me.posts[idx];var b=FB_B[idx]||0;var s=FB_S[idx]||"non pr\u00e9cis\u00e9";var c=$("fbC"+idx)?$("fbC"+idx).value:"";var an=fbAnimalsText(idx);return "<div class='recap'><b>"+aesc(p.traqueName)+" \u2014 "+aesc(p.label)+"</b><span>"+b+" balle(s) \u00b7 mirador "+s+(an?(" \u00b7 \ud83e\udd8c "+an):"")+(c?(" \u00b7 \u00ab "+aesc(c)+" \u00bb"):"")+"</span></div>";}).join("");var ov=document.createElement("div");ov.className="fbov";ov.id="fbov";ov.innerHTML="<div class='fbsheet'><h3>V\u00e9rifie ton retour</h3>"+warnHtml+"<p class='sub'>Traque \u00ab "+aesc(g.name)+" \u00bb \u2014 tu confirmes ?</p>"+recaps+"<div class='row'><button class='bmod' id='fbModBtn'>Modifier</button><button class='bcon' id='fbConfirmBtn'>Confirmer l'envoi</button></div></div>";document.body.appendChild(ov);$("fbModBtn").onclick=closeConfirm;$("fbConfirmBtn").onclick=function(){doSendTraque(g,esp,false);};}
function closeConfirm(){var ov=$("fbov");if(ov)ov.remove();}
function fbSendPost(idx){var p=me.posts[idx];var payload={userId:DATA.userId,journeeId:DATA.journeeId,trackId:p.trackId,miradorId:p.miradorId,hunter:me.name,bullets:FB_B[idx]||0,state:FB_S[idx]||"",comment:$("fbC"+idx)?$("fbC"+idx).value:"",animals:FB_A[idx]||{}};return fetch(DATA.fnUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}).then(function(r){if(!r.ok){return r.text().then(function(t){throw new Error("["+r.status+"] "+(t||"").slice(0,160));});}});}
function doSendTraque(g,esp,silent){var cb=$("fbConfirmBtn");if(cb){cb.disabled=true;cb.textContent="Envoi\u2026";}var idxs=g.idxs.slice();var i=0;function nx(){if(i>=idxs.length){closeConfirm();var sent=fbLoadSent();sent[g.trackId]=true;fbSaveSent(sent);FB_SENT=true;renderGridTile(g,true);fbBackToGrid();updateSendAll();return Promise.resolve(true);}return fbSendPost(idxs[i]).then(function(){i++;return nx();});}return nx().catch(function(e){closeConfirm();var m=$("fbMsg_"+g.trackId);if(m){m.style.color="#b91c1c";m.textContent="\u00c9chec : "+String((e&&e.message)||e);}return false;});}
function sendRien(g,esp){g.idxs.forEach(function(ix){FB_B[ix]=0;FB_S[ix]="";if(FB_A[ix]){for(var k in FB_A[ix])FB_A[ix][k]=0;}var cc=$("fbC"+ix);if(cc)cc.value="";});doSendTraque(g,esp,true);}
function sendAll(esp){if(!window.confirm("Envoyer ton retour pour toutes les traques restantes ?"))return;var sent=fbLoadSent();var groups=fbGroups().filter(function(g){return !sent[g.trackId];});var i=0;function nx(){if(i>=groups.length)return;var g=groups[i];i++;doSendTraque(g,esp,true).then(function(){nx();});}nx();}

function ouvrirUrgence(){remplirUrgence();openSheet("urgence");}
function remplirUrgence(){
  var box=document.getElementById("sosGens");if(!box)return;
  var u=DATA.urgence||{gens:{}},gens=u.gens||{},html="";
  function carte(role,id){
    var g=gens[id];if(!g||!g.n)return "";
    var h="<div class='soscard'><div class='qui'><div class='rol'>"+aesc(role)+"</div><div class='nom'>"+aesc(g.n)+"</div></div>";
    h+=g.t?("<a href='tel:"+aesc(g.t.replace(/[^0-9+]/g,""))+"'>Appeler</a>"):"<span class='sanstel'>pas de numero</span>";
    return h+"</div>";
  }
  if(u.respId)html+=carte("Responsable de la battue",u.respId);
  var vus={};
  ((me&&me.posts)||[]).forEach(function(pp){
    if(!pp.chefId||vus[pp.chefId])return;vus[pp.chefId]=1;
    if(pp.chefId===u.respId)return;
    html+=carte("Chef de ligne — "+(pp.traqueName||""),pp.chefId);
  });
  if(!html)html="<p class='soshint'>Aucun numero renseigne pour cette journee.</p>";
  box.innerHTML=html;
}
function maPosition(){
  var g=document.getElementById("sosGps"),h=document.getElementById("sosHint");
  if(!navigator.geolocation){h.textContent="Ce telephone ne donne pas la position.";return;}
  h.textContent="Recherche de ta position...";g.style.display="none";
  navigator.geolocation.getCurrentPosition(function(pos){
    var la=pos.coords.latitude.toFixed(5),lo=pos.coords.longitude.toFixed(5);
    g.textContent=la+", "+lo;g.style.display="block";
    h.textContent="Precision "+Math.round(pos.coords.accuracy||0)+" m. Dicte ces chiffres aux secours.";
  },function(){
    h.textContent="Position refusee ou introuvable. Autorise la localisation dans ton navigateur.";
  },{enableHighAccuracy:true,timeout:15000,maximumAge:0});
}
function selectHunter(i){me=DATA.chasseurs[i];renderHero();try{chatCharger();}catch(e){}var def=(me.posts[0]?me.posts[0].traqueIndex:((me.rabats&&me.rabats.length)?me.rabats[0]:0));buildTabs(def);$("pick").style.display="none";$("appview").style.display="block";window.scrollTo(0,0);}
function backToPick(){if(!FB_SENT&&fbHasData()&&!window.confirm("Tu n'as pas envoyé ton retour (balles / mirador). Changer de nom quand même ?"))return;FB_SENT=true;$("appview").style.display="none";$("pick").style.display="flex";window.scrollTo(0,0);}
function renderPicker(){var box=$("names");box.innerHTML="";if(!DATA.chasseurs.length){box.innerHTML="<p class='empty'>Aucun poste attribué pour le moment.</p>";}
if(DATA.tirage){var sub=document.querySelector(".role-c .rolesub");if(sub)sub.textContent="Choisis le numéro de ton carton pour voir tes postes :";var tl=document.createElement("p");tl.className="tirlab";tl.textContent="Quel numéro as-tu tiré ?";box.appendChild(tl);var gr=document.createElement("div");gr.className="tirgrid";DATA.chasseurs.forEach(function(cc,i){if(!cc.num)return;var b=document.createElement("button");b.className="tirbtn";b.textContent=cc.num;b.onclick=function(){selectHunter(i);};gr.appendChild(b);});box.appendChild(gr);if(DATA.chasseurs.some(function(c){return !c.num;})){var tl2=document.createElement("p");tl2.className="tirlab";tl2.textContent="Placés à la main";box.appendChild(tl2);}}
DATA.chasseurs.forEach(function(cc,i){if(DATA.tirage&&cc.num)return;var b=document.createElement("button");b.className="namebtn";b.innerHTML="🦌 "+aesc(cc.name);b.onclick=function(){selectHunter(i);};box.appendChild(b);});var rb=$("rabnames");if(rb){rb.innerHTML="";(DATA.rabatteurs||[]).forEach(function(nm){var b=document.createElement("button");b.className="namebtn";b.innerHTML="🥁 "+nm;b.onclick=function(){enterRabatteurs();};rb.appendChild(b);});}$("subpick").textContent=fmtDate(DATA.date)+" — "+DATA.territoire;var tp=$("talkiePill");if(tp&&DATA.canal){tp.textContent="📻 Canal talkie : "+DATA.canal;tp.style.display="inline-flex";}}
function enterRabatteurs(){setupRabatteurs();}
function fillLists(){var so=$("sonneries");DATA.sonneries.forEach(function(s){var li=document.createElement("li");li.innerHTML="<span class='ev'>"+aesc(s.evenement)+"</span><span>"+aesc(s.signal)+"</span>";so.appendChild(li);});var co=$("consignes");DATA.consignes.forEach(function(x){var li=document.createElement("li");li.className="rule";li.innerHTML="<span class='p'>•</span><span>"+x+"</span>";co.appendChild(li);});}
if(DATA.orgName){try{document.title=DATA.orgName;}catch(e){}var pt=$("pickTitle");if(pt)pt.textContent=DATA.orgName;}
function setupRabatteurs(){me=null;setTimeout(function(){try{chatCharger();}catch(e){}},0);$("pick").style.display="none";$("appview").style.display="block";var hero=document.querySelector("#appview .hero");if(hero)hero.style.display="none";var fc=$("feedbackCard");if(fc)fc.style.display="none";var bk=$("back");if(bk)bk.style.display="";$("myName").textContent="🥁 Rabatteurs";$("subapp").textContent=fmtDate(DATA.date)+" — "+DATA.territoire;var mh=document.querySelector(".maphint");if(mh)mh.textContent="Vue d'ensemble des traques · lecture seule";buildTabs(0);renderAttribs();window.scrollTo(0,0);}
renderPicker();fillLists();try{gpsInit();}catch(e){}try{chatInit();}catch(e){}var wb=document.getElementById("welcomeBtn");if(wb)wb.onclick=function(){var w=document.getElementById("welcome");if(w)w.style.display="none";};var rhb=document.getElementById("retourHelpBtn");if(rhb)rhb.onclick=function(){var r=document.getElementById("retourHelp");if(r)r.style.display="none";};
if(DATA.image){var im=new Image();im.onload=function(){if(im.naturalWidth&&im.naturalHeight){AR=im.naturalWidth/im.naturalHeight;var mp=$("map");if(mp&&mp.innerHTML!=="")renderMap(MAP_I);}};im.src=DATA.image;}
</scr` + `ipt></body></html>`;

function generateSharedHtml(journee, terrain, participants, safety, fnUrl, orgName, userId, photosAnn, gpsActif, chatActif) {
  const posted = {};
  (terrain.tracks || []).forEach((trk, ti) => { const pl = journee.placements[trk.id] || {}; Object.entries(pl).forEach(([hid, mid]) => { const m = trk.miradors.find((x) => x.id === mid); if (!m) return; (posted[hid] = posted[hid] || []).push({ traqueIndex: ti, trackId: trk.id, miradorId: mid, label: m.label, traqueName: trk.name, color: trk.color, consignes: [m.consignes || "", ...((terrain.consignesCommunes || []).filter((c) => (c.miradorIds || []).indexOf(mid) >= 0 && (c.text || "").trim()).map((c) => c.text))].filter(Boolean).join("\n\n"), photos: (photosAnn && photosAnn[mid]) || m.photos || [], chef: (journee.chefLignes && journee.chefLignes[mid]) ? ((participants.find((x) => x.id === journee.chefLignes[mid]) || {}).name || "") : "", chefId: (journee.chefLignes && journee.chefLignes[mid]) || "" }); }); });
  const chefLignesData = journee.chefLignes || {};
  const chefPostsOf = (hid) => Object.keys(chefLignesData).filter((mid) => chefLignesData[mid] === hid).map((mid) => { let f = null; (terrain.tracks || []).forEach((trk) => { const m = (trk.miradors || []).find((x) => x.id === mid); if (m) { const pl = journee.placements[trk.id] || {}; const occHid = Object.keys(pl).find((h) => pl[h] === mid); const occ = occHid ? participants.find((x) => x.id === occHid) : null; f = { traqueName: trk.name, label: m.label, hunter: occ ? occ.name : "" }; } }); return f; }).filter(Boolean);
  // Fusils au rabat : les traques ou ils rabattent (sans poste). Ceux qui ne font que rabattre apparaissent aussi.
  const rabatJ = normRabat(journee.rabat); const presJ = journee.presence || {};
  const rabatsDe = (hid) => (terrain.tracks || []).map((trk, ti) => (((rabatJ[trk.id] || {})[hid] && !((journee.placements[trk.id] || {})[hid])) ? ti : -1)).filter((i) => i >= 0);
  const idsCh = Object.keys(posted);
  Object.keys(rabatJ).forEach((tid) => Object.keys(rabatJ[tid] || {}).forEach((hid) => { if (idsCh.indexOf(hid) < 0 && participants.some((x) => x.id === hid) && (numDe(hid) || (presJ[hid] || {}).statut === "present") && rabatsDe(hid).length) idsCh.push(hid); }));
  const chasseurs = idsCh.map((hid) => { const p = participants.find((x) => x.id === hid); return { id: hid, name: p ? p.name : "Chasseur", num: numDe(hid), posts: posted[hid] || [], rabats: rabatsDe(hid), chefPosts: chefPostsOf(hid), chefMids: Object.keys(chefLignesData).filter((mid) => chefLignesData[mid] === hid) }; }).sort((a, b) => triAvecNumeros({ numero: a.num }, { numero: b.num }, () => byNom(a.name || "", b.name || "")));
  const urgenceData = (function () {
    const ids = {};
    Object.keys(chefLignesData).forEach((mid) => { if (chefLignesData[mid]) ids[chefLignesData[mid]] = true; });
    if (journee.responsableId) ids[journee.responsableId] = true;
    const gens = {};
    Object.keys(ids).forEach((id) => { const p = participants.find((x) => x.id === id); if (p) gens[id] = { n: p.name || "", t: String(p.phone || "").trim() }; });
    return { respId: journee.responsableId || "", gens: gens };
  })();
  // Suivi GPS : coordonnees des cartes (captures IGN) pour placer les positions, et cle secrete de la journee.
  const geoSec = {};
  (terrain.secteurs || []).forEach((s) => { if (s && s.geo && isFinite(s.geo.x1) && (terrain.tracks || []).some((t) => t.secteurId === s.id)) geoSec[s.id] = { x1: s.geo.x1, y1: s.geo.y1, x2: s.geo.x2, y2: s.geo.y2 }; });
  const gpsInfos = (gpsActif && journee.gpsCle && Object.keys(geoSec).length) ? { gps: true, gpsJ: journee.gpsCle, gpsUrl: GPS_URL, geo: geoSec } : { gps: false };
  const chatInfos = (chatActif && journee.gpsCle) ? { chat: true, chatJ: journee.gpsCle, chatUrl: GPS_URL } : { chat: false };
  const DATA = { ...gpsInfos, ...chatInfos, tirage: tirageActif(journee) && normTirage(journee.tirage).nb > 0, date: journee.date, urgence: urgenceData, canal: journee.canal || "", journeeId: journee.id, userId: userId || "", fnUrl: fnUrl || "", orgName: (orgName || "").trim(), territoire: terrain.name, image: (((terrain.secteurs || [])[0] || {}).image) || "",
    images: (function () {
      // Une carte peut servir a dix traques : on ne l'envoie qu'une fois.
      const utiles = {}; (terrain.tracks || []).forEach((t) => { if (t.secteurId) utiles[t.secteurId] = true; });
      const o = {}; (terrain.secteurs || []).forEach((s) => { if (s && s.image && utiles[s.id]) o[s.id] = s.image; });
      return o;
    })(), traques: (terrain.tracks || []).map((t) => ({ name: t.name, sec: t.secteurId || "", color: t.color, crop: t.crop || FULL_CROP, zone: Array.isArray(t.zone) ? t.zone : [], zoneFermee: !!t.zoneFermee, deposes: [].concat((t.deposes || []), (((journee.deposesJourParTraque || {})[t.id]) || [])).map((d) => ({ id: d.id, nom: d.nom, gx: d.gx, gy: d.gy })), departs: (t.departs || []).map((d) => ({ id: d.id, nom: d.nom, gx: d.gx, gy: d.gy })), voitures: (((journee.voitures || {})[t.id]) || []).map((v) => { const c = participants.find((x) => x.id === v.conducteurId); const tp = ((journee.transport || {})[t.id]) || {}; const mes = Object.keys(tp).filter((id) => (tp[id] || {}).voitureId === v.id); return { id: v.id, conducteurId: v.conducteurId, deposeId: v.deposeId || "", vehicule: v.vehicule || "", conducteur: c ? c.name : "", passagers: mes.map((id) => { const q = participants.find((x) => x.id === id); return { id: id, nom: q ? q.name : "" }; }) }; }), transport: ((journee.transport || {})[t.id]) || {}, miradors: (t.miradors || []).map((m) => ({ id: m.id, label: m.label, gx: m.gx, gy: m.gy, tir: m.tir || null })), rdv: Object.entries((journee.rdv || {})[t.id] || {}).map(([cid, pos]) => { const c = participants.find((x) => x.id === cid); return c && pos ? { chefId: cid, chefName: c.name, gx: pos.gx, gy: pos.gy } : null; }).filter(Boolean), placed: Object.entries(journee.placements[t.id] || {}).map(([hid, mid]) => { const mm = (t.miradors || []).find((x) => x.id === mid); const pp = participants.find((x) => x.id === hid); return mm ? { mid: mid, gx: mm.gx, gy: mm.gy, hunter: pp ? pp.name : "" } : null; }).filter(Boolean), arrows: (journee.arrows && journee.arrows[t.id]) || [] })), chasseurs, rabatteurs: participants.filter((p) => p.role === "rabatteur" && (journee.presence || {})[p.id] && (journee.presence || {})[p.id].statut === "present").map((p) => p.name || "Rabatteur").sort((a, b) => byNom(a, b)), sonneries: safety.sonneries, consignes: safety.consignes, especes: ESPECES.filter((e) => e.key !== "autre" && terrain.planChasse && terrain.planChasse[e.key] && terrain.planChasse[e.key].enabled).map((e) => ({ key: e.key, label: e.label, emoji: e.emoji })), attributions: ESPECES.filter((e) => e.key !== "autre" && terrain.planChasse && terrain.planChasse[e.key] && terrain.planChasse[e.key].enabled).map((e) => { const a = (journee.attributions || {})[e.key] || { mode: "libre", count: 1, note: "" }; return { label: e.label, emoji: e.emoji, mode: a.mode || "libre", count: Number(a.count) || 0, note: (a.note || "").trim() }; }) };
  // Source unique : le calcul des cônes de la page chasseurs est généré à partir
  // de tirRender, la fonction utilisée côté organisateur. Impossible qu'elles divergent.
  const tail = SHARED_TAIL.replace("/*__TIRRENDER__*/", String(tirRender).replace(/^function\s+tirRender/, "function tirRenderJS"));
  // "<" echappe : un nom contenant une balise ne peut pas sortir du script de la page.
  return SHARED_HEAD + JSON.stringify(DATA).replace(/</g, "\\u003c") + tail;
}

// Vignettes de l'écran Réglages, définies hors du composant pour que React
// conserve leur identité entre deux rendus (sinon les champs perdent le focus).
