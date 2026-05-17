import json, pathlib
p=pathlib.Path(r'C:\Users\hjw52\.openclaw\workspace\briefing-site\data\briefings.json')
data=json.loads(p.read_text(encoding='utf-8'))
entry={
"date":"2026-05-18",
"title":"환율·금리 동시 압박, 오늘 한국장은 원달러와 외국인 선물이 핵심",
"highlights":["간밤 미국장은 장기금리 부담이 남은 가운데 성장주 상대약세, 에너지·방어 업종 상대강세가 나타났습니다(추정).","지정학 이슈는 발언과 공식 집행 조치 구분이 계속 중요했고, 유가는 높은 구간에서 변동성을 이어갔습니다(추정).","오늘 한국장은 원/달러 1500선 공방과 외국인 선물 방향이 같은 쪽으로 모이는지 확인이 핵심입니다."],
"tags":["미국증시","환율","금리","유가"],"file":"./posts/2026-05-18.md",
"indices":{"sp":{"level":"7,396.20","chg":"-0.17%"},"nasdaq":{"level":"26,180.90","chg":"-0.17%"},"dow":{"level":"49,470.80","chg":"-0.11%"}},
"overnightLead":"간밤 시장은 유가 고점권과 높은 장기금리가 동시에 남아 있는 조합을 다시 가격에 반영했습니다. 지정학 관련해서는 발언은 이어졌지만, 시장은 실제 집행 조치가 붙는지 여부를 더 민감하게 보고 있습니다. 그 결과 지수 자체보다 업종 체감이 더 갈렸고, 성장주보다 방어·에너지 쪽이 상대적으로 덜 흔들렸습니다. 뒤집힐 리스크는 유가 급진정과 미10년물의 4.50% 하향 이탈입니다.",
"insightSections":{"topStory":[{"title":"핵심 사건","desc":"유가 고점권 유지와 장기금리 부담이 동시에 이어졌습니다(추정)."},{"title":"핵심 해석","desc":"발언보다 공식 집행 조치 여부가 가격 지속성을 좌우하는 구간입니다."}],"marketReaction":[{"title":"반응 경로","desc":"지정학 이슈가 유가를 자극하고, 금리·변동성을 거쳐 성장주 할인으로 연결됐습니다."},{"title":"숫자 스냅샷","desc":"S&P500 7,396.20(-0.17%), Nasdaq 26,180.90(-0.17%), Dow 49,470.80(-0.11%), UST10Y 4.58%(추정), VIX 18.20(추정)."}],"watchNow":[{"title":"환율-수급 조합","desc":"원/달러 1500선 안착과 외국인 선물 순매도 동행 여부를 먼저 확인해야 합니다."},{"title":"공식 조치 확인","desc":"SNS·인터뷰 발언과 실제 제재·통제 집행 공지는 반드시 분리해서 봐야 합니다."}],"positioning":[{"title":"주 시나리오","desc":"원/달러 상방 압력과 높은 금리 조합이 이어져 방어·현금흐름 자산 우위가 나타날 가능성이 높습니다."},{"title":"실행 힌트","desc":"3회 분할(35/35/30), 1차 60% 시작. 원/달러 진정+선물 매도 완화 시 비중 확대, 원/달러 급등+선물 매도 가속 시 총 위험비중 25% 축소."}]},
"title_en":"FX and yield pressure together; Korea should track USD/KRW and foreign futures first",
"highlights_en":["US equities stayed fragile overnight as high yields persisted, with growth lagging and defensives/energy holding better (estimate).","Geopolitical flow still requires separating commentary from formal executable action, while oil remained elevated (estimate).","For Korea today, the key check is whether USD/KRW pressure and foreign futures direction align early."],
"tags_en":["US Equities","FX","Rates","Oil"],"file_en":"./posts/2026-05-18.en.md",
"overnightLead_en":"Overnight markets repriced a familiar mix: elevated oil and still-high long yields at the same time. Geopolitical commentary remained active, but traders focused more on whether formal executable action follows. That kept index moves modest but widened sector dispersion, with defensives and energy relatively steadier than growth. The main reversal risk is a quick oil cooldown plus UST10Y slipping below 4.50%.",
"insightSections_en":{"topStory":[{"title":"Core event","desc":"Elevated oil and heavy long yields remained the dominant macro mix (estimate)."},{"title":"Core read","desc":"Price persistence now depends more on formal action than on rhetoric alone."}],"marketReaction":[{"title":"Transmission path","desc":"Geopolitical headlines lifted oil, then yield/vol pressure fed into growth-stock de-rating."},{"title":"Snapshot","desc":"S&P500 7,396.20 (-0.17%), Nasdaq 26,180.90 (-0.17%), Dow 49,470.80 (-0.11%), UST10Y 4.58% (estimate), VIX 18.20 (estimate)."}],"watchNow":[{"title":"FX-flow combination","desc":"Check first whether USD/KRW holds firm with concurrent foreign futures net selling."},{"title":"Formal execution check","desc":"Separate social/political statements from formal sanctions/control implementation."}],"positioning":[{"title":"Main scenario","desc":"Persistent FX and yield pressure favors defensive and cash-flow-heavy assets over high-multiple growth in Korea."},{"title":"Execution hint","desc":"Use 3 tranches (35/35/30), start at 60% first size; add only if FX stabilizes and selling eases, cut total risk 25% if both worsen."}]}
}
rest=[x for x in data if x.get('date')!='2026-05-18']
p.write_text(json.dumps([entry]+rest,ensure_ascii=False,indent=2),encoding='utf-8')
print('ok',len(rest)+1)
