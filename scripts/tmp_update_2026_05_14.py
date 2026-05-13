import json, pathlib
p=pathlib.Path(r'C:\Users\hjw52\.openclaw\workspace\briefing-site\data\briefings.json')
arr=json.loads(p.read_text(encoding='utf-8'))
entry={
"date":"2026-05-14",
"title":"높은 금리와 완화된 유가의 줄다리기, 한국장은 금리·환율 동행 체크",
"highlights":["간밤 시장은 유가 부담이 일부 완화됐지만 금리 고점권이 유지돼 지수 반등이 제한됐습니다(추정).","지정학 이슈는 발언과 공식 집행 조치를 구분해 봐야 하는 구간이 이어졌습니다(추정).","오늘 한국장은 미10년물 4.40%선, 원/달러, 외국인 선물 방향을 함께 확인하는 게 핵심입니다."],
"tags":["미국증시","금리","환율","지정학"],"file":"./posts/2026-05-14.md",
"indices":{"sp":{"level":"7,372.44","chg":"-0.39%"},"nasdaq":{"level":"25,956.10","chg":"-0.51%"},"dow":{"level":"49,702.18","chg":"-0.12%"}},
"overnightLead":"간밤 핵심은 유가가 일부 진정됐는데도 장기금리가 높은 구간에 머물렀다는 점입니다. 시장은 이를 물가 불안 완화와 할인율 부담 지속의 혼합 신호로 해석해 지수 방향성을 크게 열지 않았습니다. 지정학 이슈도 발언과 공식 집행 조치가 엇갈릴 수 있어 업종별 대응이 더 중요해졌습니다. 뒤집힐 리스크는 미10년물 4.40% 하향 복귀와 원/달러 안정 동시 확인입니다.",
"insightSections":{"topStory":[{"title":"핵심 사건","desc":"유가 되돌림과 금리 고점권 유지가 동시에 나타났습니다(추정)."},{"title":"핵심 해석","desc":"한 변수는 완화됐지만 금리 부담이 남아 지수보다 업종 차별화가 강화됐습니다."}],"marketReaction":[{"title":"반응 경로","desc":"지정학/에너지 뉴스 이후 유가·변동성, 금리, 지수·섹터 순으로 가격이 반응했습니다."},{"title":"숫자 스냅샷","desc":"S&P500 7,372.44(-0.39%), Nasdaq 25,956.10(-0.51%), Dow 49,702.18(-0.12%), UST10Y 4.44% 내외(추정), VIX 18.41 내외(추정)."}],"watchNow":[{"title":"금리-환율 조합","desc":"미10년 4.40% 상단 유지와 원/달러 상승이 겹치면 한국 성장주 변동성이 커질 수 있습니다."},{"title":"공식 조치 확인","desc":"지정학 발언과 실제 제재·봉쇄 같은 공식 집행 조치를 반드시 분리해 확인해야 합니다."}],"positioning":[{"title":"주 시나리오","desc":"금리 고점권+원/달러 상방 압력이 하루 더 유지되며 방어·금융 상대강세가 이어질 가능성이 높습니다."},{"title":"실행 힌트","desc":"3회 분할(40/30/30), 1차 진입 60~70%. 미10년 4.38% 하향+원/달러 안정 시 성장 비중 10~15% 복원, 유가 재급등+외국인 선물 순매도 동반 시 총 위험비중 20% 축소."}]},
"title_en":"High yields vs softer oil: Korea should watch rates and FX together",
"highlights_en":["Oil stress eased overnight, but high long-end yields still capped equity upside (estimate).","Geopolitical pricing still requires separating commentary from formal executable actions (estimate).","For Korea today, watch UST10Y around 4.40%, USD/KRW, and foreign futures flow together."],
"tags_en":["US Equities","Rates","FX","Geopolitics"],"file_en":"./posts/2026-05-14.en.md",
"overnightLead_en":"The overnight setup was a tug-of-war between easing oil pressure and still-high long-end yields. Markets treated this as mixed: better inflation optics, but persistent discount-rate pressure on growth valuation. With geopolitics still headline-sensitive, sector selection mattered more than broad index direction. The flip risk is a joint move of UST10Y below 4.40% and a steadier KRW.",
"insightSections_en":{"topStory":[{"title":"Core event","desc":"Partial oil pullback happened while long-end yields stayed elevated (estimate)."},{"title":"Core read","desc":"One pressure eased, but valuation headwind stayed, keeping sector dispersion high."}],"marketReaction":[{"title":"Transmission path","desc":"Geopolitical/energy headlines moved oil-vol first, then yields, then index and sector pricing."},{"title":"Snapshot","desc":"S&P500 7,372.44 (-0.39%), Nasdaq 25,956.10 (-0.51%), Dow 49,702.18 (-0.12%), UST10Y around 4.44% (estimate), VIX around 18.41 (estimate)."}],"watchNow":[{"title":"Rates-FX combo","desc":"If UST10Y stays above 4.40% with higher USD/KRW, Korea growth volatility can expand."},{"title":"Commentary vs execution","desc":"Separate geopolitical statements from formal executable sanctions/blockade actions."}],"positioning":[{"title":"Main scenario","desc":"Sticky-high yields with FX pressure favors defensives and financials over expensive growth for another session."},{"title":"Execution hint","desc":"Use 3 tranches (40/30/30), first size 60-70%; rebuild growth by 10-15% only if UST10Y <4.38% with steadier KRW, cut total risk ~20% if oil re-accelerates with foreign futures net selling."}]}
}
arr=[x for x in arr if x.get('date')!='2026-05-14']
arr.insert(0,entry)
p.write_text(json.dumps(arr,ensure_ascii=False,indent=2),encoding='utf-8')
print('ok')