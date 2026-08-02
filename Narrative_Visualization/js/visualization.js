"use strict";

const DURATION = 1100;
const CALLOUT_FADE_DURATION = 320;

const T = {
    width: 920,
    height: 430,

    margin: {
        top: 42,
        right: 245,
        bottom: 58,
        left: 82
    },

    callout: {
        x: 700,
        centerY: 215,
        width: 185
    }
};

const M = {
    width: 1100,
    height: 620,

    x: 8,
    y: 62,
    scale: 0.73,

    callout: {
        x: 870,
        centerY: 310,
        width: 195
    }
};

const scenes = [
    {
        id: "initial",
        label: "Initial surge",
        date: "2020-04-10",
        days: 20,

        title:
            "The first national spike was built from a regional emergency",

        summary:
            "The national curve makes spring 2020 look like a countrywide event. The map reveals that a disproportionate share of the early burden was concentrated in the Northeast.",

        context:
            "Community transmission had begun before widespread testing could fully detect it. Multiple introductions, limited early surveillance, and rapid transmission in dense metropolitan areas allowed the outbreak to become severe before its geographic concentration was widely understood.",

        purpose:
            "This scene establishes the central problem with a national total: it combines very different local experiences into one apparently unified curve.",

        lineAnnotationTitle:
            "The outbreak was visible late",

        lineAnnotationText:
            "The first reported spike became visible only after community transmission was already underway.",

        mapAnnotationTitle:
            "One region carried the early curve",

        mapAnnotationText:
            "The population-adjusted map shows that the first national rise depended heavily on a concentrated regional outbreak."
    },

    {
        id: "summer",
        label: "Summer 2020",
        date: "2020-07-23",
        days: 24,

        title:
            "The epidemic did not simply expand—it changed its geographic and demographic center",

        summary:
            "The summer rise was not just a larger version of the spring outbreak. New hotspots emerged outside the Northeast, and reported cases increasingly involved younger people.",

        context:
            "Mobility, reopening, social contact, local vulnerability, and uneven mitigation probably contributed in different combinations. CDC reporting also documented a substantial decline in the median age of reported cases during this period.",

        purpose:
            "The second spike shows that the same national measure can represent a fundamentally different epidemic underneath it.",

        lineAnnotationTitle:
            "A new spike with a new profile",

        lineAnnotationText:
            "The second national rise emerged from a different geographic and demographic pattern than the first.",

        mapAnnotationTitle:
            "The center of burden moved",

        mapAnnotationText:
            "Population-adjusted rates identify where residents faced the greatest proportional burden, rather than simply highlighting the largest states."
    },

    {
        id: "winter",
        label: "Winter 2020–21",
        date: "2021-01-08",
        days: 28,

        title:
            "By winter, separate regional outbreaks had become a broad national crisis",

        summary:
            "Earlier spikes had clear geographic centers. The winter peak was different: high rates appeared across much of the country at the same time.",

        context:
            "Widespread community transmission, increased indoor contact, holiday travel and gatherings, and transmission from people without symptoms created conditions for sustained growth across many regions. Alpha was only beginning to emerge and should not be treated as the sole explanation.",

        purpose:
            "This is the point where the national curve most closely begins to represent a genuinely national experience rather than one dominant regional emergency.",

        lineAnnotationTitle:
            "Scale and geographic breadth increased together",

        lineAnnotationText:
            "The winter peak rose far above the earlier spikes and reflected widespread simultaneous transmission.",

        mapAnnotationTitle:
            "No longer a regional outbreak",

        mapAnnotationText:
            "High recent rates appeared across much more of the country, transforming the meaning of the national peak."
    },

    {
        id: "delta",
        label: "Delta",
        date: "2021-09-01",
        days: 27,

        title:
            "Delta created another national wave, but protection was distributed unevenly",

        summary:
            "The national curve rose again, yet the state map remained highly uneven. A shared variant did not produce an equal burden everywhere.",

        context:
            "Delta was more transmissible than earlier variants and became predominant during summer 2021. Vaccination coverage and prior immunity differed substantially among states, while severe outcomes remained much more common among unvaccinated people.",

        purpose:
            "Variant biology helps explain why the curve rose, but it does not fully explain where the burden became greatest. Population protection and local conditions still mattered.",

        lineAnnotationTitle:
            "A more transmissible variant reversed the decline",

        lineAnnotationText:
            "The spring decline ended as Delta became predominant and reported cases accelerated again.",

        mapAnnotationTitle:
            "A common variant, an unequal burden",

        mapAnnotationText:
            "The state rates show that the Delta resurgence was nationally visible but not evenly experienced."
    },

    {
        id: "omicron",
        label: "Omicron",
        date: "2022-01-10",
        days: 23,

        title:
            "Omicron briefly made the national curve and the state maps tell the same story",

        summary:
            "Omicron produced both the sharpest national increase and one of the broadest simultaneous geographic burdens in the visualization.",

        context:
            "Omicron replaced Delta extraordinarily quickly in late 2021. Its rapid growth, immune escape, and high transmissibility produced a much more synchronized increase than the earlier regionally staggered outbreaks.",

        purpose:
            "Unlike the first several scenes, the enormous national spike was not mainly hiding one regional center. The breadth of the map confirms the national character of the event.",

        lineAnnotationTitle:
            "Rapid replacement produced exceptional speed",

        lineAnnotationText:
            "Omicron became predominant in a matter of weeks, coinciding with the largest reported-case spike.",

        mapAnnotationTitle:
            "The broadest synchronized burden",

        mapAnnotationText:
            "High rates appeared across a large portion of the country at once, making this the closest example of a shared national wave."
    },

    {
        id: "ba5",
        label: "BA.5",
        date: "2022-07-15",
        days: 30,

        title:
            "Later reported-case peaks became smaller partly because the measurement itself was changing",

        summary:
            "The summer 2022 rise appears modest beside the first Omicron peak. But official case counts were also capturing a decreasing share of infections as home testing became more common.",

        context:
            "Successive Omicron descendants, including BA.2 and BA.5, continued to replace one another. At the same time, changes in testing behavior made reported case counts less complete than they had been earlier in the pandemic.",

        purpose:
            "The final scene warns against treating every vertical difference in the timeline as a direct difference in true infections. The data-generating process changed along with the virus.",

        lineAnnotationTitle:
            "A new variant and a changing measure",

        lineAnnotationText:
            "BA.5 was associated with another rise, but official reports represented a less complete measure of infections than before.",

        mapAnnotationTitle:
            "Smaller nationally, still substantial locally",

        mapAnnotationText:
            "The map reveals meaningful state-level burden even though the reported national peak appears smaller."
    }
];

const narrativeState = {
    currentScene: 0,
    previousScene: 0,
    renderId: 0
};

const timelineSvg = d3.select("#timeline");
const mapSvg = d3.select("#map");

const parseDate =
    d3.timeParse("%Y-%m-%d");

const dateKeyFormat =
    d3.timeFormat("%Y-%m-%d");

const fullDateFormat =
    d3.timeFormat("%B %d, %Y");

const monthYearFormat =
    d3.timeFormat("%b %Y");

const integerFormat =
    d3.format(",");

const rateFormat =
    d3.format(",.0f");

const compactNumberFormat =
    d3.format("~s");

const tooltip = d3.select("body")
    .selectAll("div.tooltip")
    .data([null])
    .join("div")
    .attr("class", "tooltip")
    .attr("role", "status")
    .attr("aria-live", "polite")
    .attr("hidden", true);

let covidData = [];
let populationData = [];
let topology = null;

let nationalSeries = [];
let recordsByState = new Map();
let populationByFips = new Map();
let mapRecordsByScene = new Map();

let mapColorScale;

/* -------------------------------------------------------
   Initialization
------------------------------------------------------- */

async function init() {
    showLoadingState();

    try {
        [
            covidData,
            populationData,
            topology
        ] = await Promise.all([
            d3.csv(
                "data/us-states.csv",

                row => ({
                    date:
                        parseDate(row.date),

                    dateString:
                        row.date,

                    state:
                        row.state,

                    fips:
                        row.fips
                            ? String(row.fips)
                                .padStart(2, "0")
                            : null,

                    cases:
                        Number(row.cases),

                    deaths:
                        Number(row.deaths)
                })
            ),

            d3.csv(
                "data/state_population_2020_2025.csv",

                row => ({
                    state:
                        row.state,

                    fips:
                        String(row.fips)
                            .padStart(2, "0"),

                    population2020Base:
                        Number(
                            row.population_2020_base
                        ),

                    population2020:
                        Number(
                            row.population_2020
                        ),

                    population2021:
                        Number(
                            row.population_2021
                        ),

                    population2022:
                        Number(
                            row.population_2022
                        ),

                    population2023:
                        Number(
                            row.population_2023
                        ),

                    population2024:
                        Number(
                            row.population_2024
                        ),

                    population2025:
                        Number(
                            row.population_2025
                        )
                })
            ),

            d3.json(
                "data/states-albers-10m.json"
            )
        ]);

        validateData();
        prepareData();

        moveSceneButtonsToTop();
        buildSceneButtons();
        installNavigationTriggers();
        updateStorySectionHeadings();

        renderScene(false);
    } catch (error) {
        console.error(
            "Unable to initialize visualization:",
            error
        );

        showErrorState(
            "Unable to load one or more data files."
        );
    }
}

function validateData() {
    if (
        !Array.isArray(covidData) ||
        covidData.length === 0
    ) {
        throw new Error(
            "The COVID-19 data file is empty."
        );
    }

    if (
        !Array.isArray(populationData) ||
        populationData.length === 0
    ) {
        throw new Error(
            "The population data file is empty."
        );
    }

    if (
        !topology ||
        !topology.objects ||
        !topology.objects.states ||
        !topology.objects.nation
    ) {
        throw new Error(
            "The TopoJSON file is missing the expected objects."
        );
    }
}

/* -------------------------------------------------------
   Navigation
------------------------------------------------------- */

function moveSceneButtonsToTop() {
    const scene =
        document.querySelector(".scene");

    const sceneLayout =
        document.querySelector(".scene-layout");

    const navigation =
        document.querySelector(
            "#numbered-navigation"
        );

    if (
        !scene ||
        !sceneLayout ||
        !navigation
    ) {
        return;
    }

    scene.insertBefore(
        navigation,
        sceneLayout
    );

    navigation.setAttribute(
        "aria-label",
        "Choose a scene"
    );

    Object.assign(
        navigation.style,
        {
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            margin: "0 0 18px 0",
            padding: "0 0 12px 0",
            borderBottom:
                "1px solid #d4dce3"
        }
    );
}

function buildSceneButtons() {
    const buttons =
        d3.select(
            "#numbered-navigation"
        )
            .selectAll("button")
            .data(scenes)
            .join("button")
            .attr(
                "type",
                "button"
            )
            .attr(
                "class",
                "scene-button"
            )
            .attr(
                "data-scene-index",
                (scene, index) =>
                    index
            )
            .attr(
                "aria-label",
                (scene, index) =>
                    `Scene ${index + 1}: ${scene.label}`
            )
            .text(
                (scene, index) =>
                    index + 1
            );

    buttons.each(function () {
        Object.assign(
            this.style,
            {
                display: "inline-flex",
                width: "27px",
                minWidth: "27px",
                height: "27px",
                minHeight: "27px",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                margin: "0",
                borderRadius: "0",
                fontSize: "12px",
                fontWeight: "400",
                textAlign: "center"
            }
        );
    });
}

function updateStorySectionHeadings() {
    const contextHeading =
        document.querySelector(
            ".context-block h3"
        );

    const purposeHeading =
        document.querySelector(
            ".purpose-block h3"
        );

    if (contextHeading) {
        contextHeading.textContent =
            "Why did this spike take this form?";
    }

    if (purposeHeading) {
        purposeHeading.textContent =
            "Why this changes the story";
    }
}

function installNavigationTriggers() {
    d3.select("#previous-button")
        .on("click", () => {
            goToScene(
                narrativeState.currentScene -
                1
            );
        });

    d3.select("#next-button")
        .on("click", () => {
            goToScene(
                narrativeState.currentScene +
                1
            );
        });

    d3.selectAll(".scene-button")
        .on("click", function () {
            goToScene(
                Number(
                    this.dataset.sceneIndex
                )
            );
        });
}

function goToScene(nextSceneIndex) {
    if (
        nextSceneIndex < 0 ||
        nextSceneIndex >= scenes.length ||
        nextSceneIndex ===
            narrativeState.currentScene
    ) {
        return;
    }

    narrativeState.previousScene =
        narrativeState.currentScene;

    narrativeState.currentScene =
        nextSceneIndex;

    renderScene(true);
}

function updateNavigationControls() {
    const currentIndex =
        narrativeState.currentScene;

    d3.select("#previous-button")
        .property(
            "disabled",
            currentIndex === 0
        );

    d3.select("#next-button")
        .property(
            "disabled",
            currentIndex ===
                scenes.length - 1
        );

    d3.select("#navigation-status")
        .text(
            `Scene ${currentIndex + 1} of ${scenes.length}`
        );

    d3.selectAll(".scene-button")
        .classed(
            "active",

            function () {
                return (
                    Number(
                        this.dataset.sceneIndex
                    ) === currentIndex
                );
            }
        )
        .attr(
            "aria-current",

            function () {
                return (
                    Number(
                        this.dataset.sceneIndex
                    ) === currentIndex
                )
                    ? "step"
                    : null;
            }
        )
        .each(function () {
            const isActive =
                Number(
                    this.dataset.sceneIndex
                ) === currentIndex;

            Object.assign(
                this.style,
                {
                    color:
                        isActive
                            ? "#ffffff"
                            : "#374958",

                    background:
                        isActive
                            ? "#6d6d6d"
                            : "#ffffff",

                    border:
                        "1px solid #aab3ba"
                }
            );
        });
}

/* -------------------------------------------------------
   Data preparation
------------------------------------------------------- */

function prepareData() {
    populationByFips = new Map(
        populationData.map(record => [
            record.fips,
            record
        ])
    );

    recordsByState = d3.group(
        covidData.filter(record =>
            record.fips
        ),

        record =>
            record.fips
    );

    recordsByState.forEach(records => {
        records.sort(
            (a, b) =>
                d3.ascending(
                    a.date,
                    b.date
                )
        );
    });

    prepareNationalSeries();
    prepareMapRecords();
    prepareMapColorScale();
}

function prepareNationalSeries() {
    const recordsByDate = d3.group(
        covidData.filter(record =>
            record.fips
        ),

        record =>
            record.dateString
    );

    nationalSeries = Array.from(
        recordsByDate,

        ([dateString, records]) => ({
            dateString,

            date:
                parseDate(dateString),

            cumulativeCases:
                d3.sum(
                    records,
                    record =>
                        record.cases
                )
        })
    ).sort(
        (a, b) =>
            d3.ascending(
                a.date,
                b.date
            )
    );

    nationalSeries.forEach(
        (record, index) => {
            if (index === 0) {
                record.newCases = 0;
                return;
            }

            record.newCases = Math.max(
                0,

                record.cumulativeCases -
                nationalSeries[index - 1]
                    .cumulativeCases
            );
        }
    );

    nationalSeries.forEach(
        (record, index) => {
            record.sevenDayAverage =
                d3.mean(
                    nationalSeries.slice(
                        Math.max(
                            0,
                            index - 6
                        ),

                        index + 1
                    ),

                    item =>
                        item.newCases
                );
        }
    );
}

function getPopulationForYear(
    populationRecord,
    year
) {
    const value =
        populationRecord[
            `population${year}`
        ];

    if (
        Number.isFinite(value) &&
        value > 0
    ) {
        return value;
    }

    return populationRecord
        .population2020Base;
}

function findStateRecord(
    fips,
    dateString
) {
    return recordsByState
        .get(fips)
        ?.find(
            record =>
                record.dateString ===
                dateString
        ) || null;
}

function calculateStateMetric(
    fips,
    sceneDateString
) {
    const endDate =
        parseDate(sceneDateString);

    const startDate =
        d3.timeDay.offset(
            endDate,
            -7
        );

    const endRecord =
        findStateRecord(
            fips,
            sceneDateString
        );

    const startRecord =
        findStateRecord(
            fips,
            dateKeyFormat(startDate)
        );

    const populationRecord =
        populationByFips.get(fips);

    if (
        !endRecord ||
        !startRecord ||
        !populationRecord
    ) {
        return null;
    }

    const population =
        getPopulationForYear(
            populationRecord,
            endDate.getFullYear()
        );

    const weeklyCases =
        Math.max(
            0,

            endRecord.cases -
            startRecord.cases
        );

    return {
        state:
            endRecord.state,

        fips,

        date:
            endRecord.date,

        population,

        weeklyCases,

        casesPer100k:
            (
                weeklyCases /
                population
            ) * 100000,

        cumulativeCases:
            endRecord.cases,

        cumulativeDeaths:
            endRecord.deaths
    };
}

function prepareMapRecords() {
    mapRecordsByScene =
        new Map();

    scenes.forEach(scene => {
        const records =
            populationData
                .map(
                    populationRecord =>
                        calculateStateMetric(
                            populationRecord.fips,
                            scene.date
                        )
                )
                .filter(Boolean);

        mapRecordsByScene.set(
            scene.id,
            records
        );
    });
}

function prepareMapColorScale() {
    const allRecords =
        Array.from(
            mapRecordsByScene.values()
        ).flat();

    const maximum =
        d3.max(
            allRecords,
            record =>
                record.casesPer100k
        ) || 1;

    mapColorScale =
        d3.scaleSequentialSqrt(
            [0, maximum],
            d3.interpolateOrRd
        );

    const legendScale =
        d3.scaleSqrt()
            .domain([
                0,
                maximum
            ])
            .range([
                0,
                1
            ]);

    const legendValues = [
        0,
        0.25,
        0.5,
        0.75,
        1
    ].map(position =>
        legendScale.invert(position)
    );

    d3.select("#legend-ticks")
        .selectAll("span")
        .data(legendValues)
        .join("span")
        .text(rateFormat);
}

/* -------------------------------------------------------
   Scene rendering
------------------------------------------------------- */

function renderScene(animate) {
    narrativeState.renderId += 1;

    const renderId =
        narrativeState.renderId;

    const scene =
        scenes[
            narrativeState.currentScene
        ];

    const previousScene =
        scenes[
            narrativeState.previousScene
        ];

    hideTooltip();

    updateStory(scene);
    updateNavigationControls();

    drawTimeline(
        scene,
        previousScene,
        animate,
        renderId
    );

    drawMap(
        scene,
        previousScene,
        animate,
        renderId
    );
}

function updateStory(scene) {
    d3.select("#scene-number")
        .text(
            `Scene ${narrativeState.currentScene + 1} of ${scenes.length}`
        );

    d3.select("#scene-title")
        .text(
            scene.title
        );

    d3.select("#scene-summary")
        .text(
            scene.summary
        );

    d3.select("#scene-context")
        .text(
            scene.context
        );

    d3.select("#scene-purpose")
        .text(
            scene.purpose
        );

    d3.select(
        "#interaction-instructions"
    )
        .text(
            "Hover over the revealed timeline or a state for details."
        );

    d3.select("#active-wave-label")
        .text(
            `${scene.label}: ` +
            `${fullDateFormat(
                parseDate(scene.date)
            )}`
        );

    d3.select("#map-date-label")
        .text(
            `Seven days ending ` +
            `${fullDateFormat(
                parseDate(scene.date)
            )}`
        );
}

/* -------------------------------------------------------
   Annotation helpers
------------------------------------------------------- */

function findNearestNationalRecord(
    targetDate
) {
    const bisector =
        d3.bisector(
            record =>
                record.date
        ).center;

    return nationalSeries[
        bisector(
            nationalSeries,
            targetDate
        )
    ];
}

function wrapSvgText(
    selection,
    text,
    width,
    lineHeight
) {
    const words =
        String(text)
            .trim()
            .split(/\s+/);

    let line = [];
    let lineNumber = 0;

    let tspan =
        selection.append("tspan")
            .attr("x", 0)
            .attr("dy", 0);

    words.forEach(word => {
        line.push(word);

        tspan.text(
            line.join(" ")
        );

        if (
            tspan.node()
                .getComputedTextLength() >
            width
        ) {
            line.pop();

            tspan.text(
                line.join(" ")
            );

            line = [word];
            lineNumber += 1;

            tspan =
                selection.append("tspan")
                    .attr("x", 0)
                    .attr(
                        "dy",
                        lineHeight
                    )
                    .text(word);
        }
    });

    return lineNumber + 1;
}

function drawCallout({
    layer,
    targetX,
    targetY,
    configuration,
    title,
    paragraph,
    svgHeight,
    animate
}) {
    layer
        .selectAll("*")
        .remove();

    const group =
        layer.append("g")
            .attr(
                "pointer-events",
                "none"
            )
            .attr(
                "opacity",
                animate
                    ? 0
                    : 1
            );

    const textGroup =
        group.append("g");

    const titleText =
        textGroup.append("text")
            .attr(
                "font-size",
                14
            )
            .attr(
                "font-weight",
                700
            )
            .attr(
                "fill",
                "#182432"
            );

    const titleLines =
        wrapSvgText(
            titleText,
            title,
            configuration.width,
            17
        );

    const paragraphText =
        textGroup.append("text")
            .attr(
                "y",
                titleLines * 17 + 10
            )
            .attr(
                "font-size",
                12
            )
            .attr(
                "fill",
                "#596878"
            );

    wrapSvgText(
        paragraphText,
        paragraph,
        configuration.width,
        15
    );

    const bounds =
        textGroup.node()
            .getBBox();

    const padding = 10;

    const boxHeight =
        bounds.height +
        padding * 2;

    const boxTop =
        Math.max(
            16,

            Math.min(
                configuration.centerY -
                boxHeight / 2,

                svgHeight -
                boxHeight -
                16
            )
        );

    textGroup.attr(
        "transform",

        `translate(${
            configuration.x +
            padding
        },${
            boxTop +
            padding -
            bounds.y
        })`
    );

    group.insert(
        "rect",
        "g"
    )
        .attr(
            "x",
            configuration.x
        )
        .attr(
            "y",
            boxTop
        )
        .attr(
            "width",
            configuration.width +
            padding * 2
        )
        .attr(
            "height",
            boxHeight
        )
        .attr(
            "fill",
            "rgba(241,244,246,.98)"
        )
        .attr(
            "stroke",
            "#c8d0d8"
        );

    const connectorY =
        boxTop +
        boxHeight / 2;

    const elbowX =
        Math.max(
            targetX + 25,
            configuration.x - 58
        );

    group.insert(
        "path",
        "rect"
    )
        .attr(
            "d",

            `M ${targetX} ${targetY}
             L ${elbowX} ${connectorY}
             L ${configuration.x} ${connectorY}`
        )
        .attr(
            "fill",
            "none"
        )
        .attr(
            "stroke",
            "#687580"
        )
        .attr(
            "stroke-width",
            1.35
        );

    group.insert(
        "circle",
        "rect"
    )
        .attr(
            "cx",
            targetX
        )
        .attr(
            "cy",
            targetY
        )
        .attr(
            "r",
            6
        )
        .attr(
            "fill",
            "#d4a24b"
        )
        .attr(
            "stroke",
            "#ffffff"
        )
        .attr(
            "stroke-width",
            1.5
        );

    if (animate) {
        group.transition()
            .duration(
                CALLOUT_FADE_DURATION
            )
            .attr(
                "opacity",
                1
            );
    }
}

/* -------------------------------------------------------
   Timeline
------------------------------------------------------- */

function drawTimeline(
    scene,
    previousScene,
    animate,
    renderId
) {
    timelineSvg
        .selectAll("*")
        .interrupt();

    timelineSvg
        .selectAll("*")
        .remove();

    const margin =
        T.margin;

    const plotRight =
        T.width -
        margin.right;

    const xScale =
        d3.scaleTime()
            .domain(
                d3.extent(
                    nationalSeries,
                    record =>
                        record.date
                )
            )
            .range([
                margin.left,
                plotRight
            ]);

    const yScale =
        d3.scaleLinear()
            .domain([
                0,

                d3.max(
                    nationalSeries,
                    record =>
                        record.sevenDayAverage
                ) || 1
            ])
            .nice()
            .range([
                T.height -
                margin.bottom,

                margin.top
            ]);

    const lineGenerator =
        d3.line()
            .defined(record =>
                Number.isFinite(
                    record.sevenDayAverage
                )
            )
            .x(record =>
                xScale(record.date)
            )
            .y(record =>
                yScale(
                    record.sevenDayAverage
                )
            );

    const areaGenerator =
        d3.area()
            .defined(record =>
                Number.isFinite(
                    record.sevenDayAverage
                )
            )
            .x(record =>
                xScale(record.date)
            )
            .y0(
                T.height -
                margin.bottom
            )
            .y1(record =>
                yScale(
                    record.sevenDayAverage
                )
            );

    const selectedDate =
        parseDate(scene.date);

    const previousDate =
        parseDate(previousScene.date);

    const selectedX =
        xScale(selectedDate);

    const previousX =
        xScale(previousDate);

    const currentWindowStart =
        d3.timeDay.offset(
            selectedDate,
            -scene.days
        );

    const currentWindowEnd =
        d3.timeDay.offset(
            selectedDate,
            scene.days
        );

    const previousWindowStart =
        d3.timeDay.offset(
            previousDate,
            -previousScene.days
        );

    const previousWindowEnd =
        d3.timeDay.offset(
            previousDate,
            previousScene.days
        );

    const waveWindow =
        timelineSvg.append("rect")
            .attr(
                "class",
                "active-wave-window"
            )
            .attr(
                "x",
                animate
                    ? xScale(
                        previousWindowStart
                    )
                    : xScale(
                        currentWindowStart
                    )
            )
            .attr(
                "y",
                margin.top
            )
            .attr(
                "width",
                animate
                    ? Math.max(
                        0,

                        xScale(
                            previousWindowEnd
                        ) -
                        xScale(
                            previousWindowStart
                        )
                    )
                    : Math.max(
                        0,

                        xScale(
                            currentWindowEnd
                        ) -
                        xScale(
                            currentWindowStart
                        )
                    )
            )
            .attr(
                "height",
                T.height -
                margin.top -
                margin.bottom
            );

    if (animate) {
        waveWindow.transition()
            .duration(DURATION)
            .ease(
                d3.easeCubicInOut
            )
            .attr(
                "x",
                xScale(
                    currentWindowStart
                )
            )
            .attr(
                "width",
                Math.max(
                    0,

                    xScale(
                        currentWindowEnd
                    ) -
                    xScale(
                        currentWindowStart
                    )
                )
            );
    }

    timelineSvg.append("g")
        .attr(
            "class",
            "grid"
        )
        .attr(
            "transform",
            `translate(${margin.left},0)`
        )
        .call(
            d3.axisLeft(yScale)
                .ticks(5)
                .tickSize(
                    -(
                        plotRight -
                        margin.left
                    )
                )
                .tickFormat("")
        );

    timelineSvg.append("g")
        .attr(
            "class",
            "axis"
        )
        .attr(
            "transform",
            `translate(0,${
                T.height -
                margin.bottom
            })`
        )
        .call(
            d3.axisBottom(xScale)
                .ticks(
                    d3.timeMonth.every(4)
                )
                .tickFormat(
                    monthYearFormat
                )
        );

    timelineSvg.append("g")
        .attr(
            "class",
            "axis"
        )
        .attr(
            "transform",
            `translate(${margin.left},0)`
        )
        .call(
            d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(
                    compactNumberFormat
                )
        );

    timelineSvg.append("text")
        .attr(
            "class",
            "axis-label"
        )
        .attr(
            "transform",
            `translate(22,${
                T.height / 2
            }) rotate(-90)`
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "7-day average of newly reported cases"
        );

    const clipId =
        `timeline-clip-${renderId}`;

    const initialRevealX =
        animate
            ? previousX
            : selectedX;

    const clipRectangle =
        timelineSvg.append("defs")
            .append("clipPath")
            .attr(
                "id",
                clipId
            )
            .append("rect")
            .attr(
                "x",
                margin.left
            )
            .attr(
                "y",
                margin.top - 10
            )
            .attr(
                "height",
                T.height -
                margin.top -
                margin.bottom +
                20
            )
            .attr(
                "width",
                Math.max(
                    0,

                    initialRevealX -
                    margin.left
                )
            );

    const progressiveLayer =
        timelineSvg.append("g")
            .attr(
                "clip-path",
                `url(#${clipId})`
            );

    progressiveLayer.append("path")
        .datum(nationalSeries)
        .attr(
            "class",
            "timeline-area"
        )
        .attr(
            "d",
            areaGenerator
        );

    progressiveLayer.append("path")
        .datum(nationalSeries)
        .attr(
            "class",
            "timeline-line"
        )
        .attr(
            "d",
            lineGenerator
        );

    const revealTransition =
        clipRectangle.transition()
            .duration(
                animate
                    ? DURATION
                    : 0
            )
            .ease(
                d3.easeCubicInOut
            )
            .attr(
                "width",
                Math.max(
                    0,

                    selectedX -
                    margin.left
                )
            );

    const activeRule =
        timelineSvg.append("line")
            .attr(
                "class",
                "active-wave-rule"
            )
            .attr(
                "x1",
                animate
                    ? previousX
                    : selectedX
            )
            .attr(
                "x2",
                animate
                    ? previousX
                    : selectedX
            )
            .attr(
                "y1",
                margin.top
            )
            .attr(
                "y2",
                T.height -
                margin.bottom
            )
            .attr(
                "opacity",
                animate
                    ? 0.65
                    : 1
            );

    const ruleTransition =
        activeRule.transition()
            .duration(
                animate
                    ? DURATION
                    : 0
            )
            .ease(
                d3.easeCubicInOut
            )
            .attr(
                "x1",
                selectedX
            )
            .attr(
                "x2",
                selectedX
            )
            .attr(
                "opacity",
                1
            );

    const activePointLayer =
        timelineSvg.append("g");

    const calloutLayer =
        timelineSvg.append("g");

    const selectedRecord =
        findNearestNationalRecord(
            selectedDate
        );

    function renderActivePointAndCallout() {
        if (
            renderId !==
            narrativeState.renderId
        ) {
            return;
        }

        activePointLayer.append("circle")
            .attr(
                "class",
                "wave-marker active"
            )
            .attr(
                "cx",
                xScale(
                    selectedRecord.date
                )
            )
            .attr(
                "cy",
                yScale(
                    selectedRecord
                        .sevenDayAverage
                )
            )
            .attr(
                "r",
                animate
                    ? 0
                    : 7
            )
            .attr(
                "opacity",
                animate
                    ? 0
                    : 1
            )
            .transition()
            .duration(
                animate
                    ? CALLOUT_FADE_DURATION
                    : 0
            )
            .attr(
                "r",
                7
            )
            .attr(
                "opacity",
                1
            );

        activePointLayer.append("text")
            .attr(
                "class",
                "wave-marker-label active"
            )
            .attr(
                "x",
                xScale(
                    selectedRecord.date
                )
            )
            .attr(
                "y",
                yScale(
                    selectedRecord
                        .sevenDayAverage
                ) - 14
            )
            .attr(
                "text-anchor",
                "middle"
            )
            .attr(
                "opacity",
                animate
                    ? 0
                    : 1
            )
            .text(
                scene.label
            )
            .transition()
            .duration(
                animate
                    ? CALLOUT_FADE_DURATION
                    : 0
            )
            .attr(
                "opacity",
                1
            );

        drawCallout({
            layer:
                calloutLayer,

            targetX:
                xScale(
                    selectedRecord.date
                ),

            targetY:
                yScale(
                    selectedRecord
                        .sevenDayAverage
                ),

            configuration:
                T.callout,

            title:
                scene.lineAnnotationTitle,

            paragraph:
                `${scene.lineAnnotationText} ` +
                `On ${fullDateFormat(
                    selectedRecord.date
                )}, the seven-day average was approximately ` +
                `${integerFormat(
                    Math.round(
                        selectedRecord
                            .sevenDayAverage
                    )
                )} newly reported cases per day.`,

            svgHeight:
                T.height,

            animate
        });
    }

    if (animate) {
        Promise.all([
            revealTransition.end(),
            ruleTransition.end()
        ])
            .then(
                renderActivePointAndCallout
            )
            .catch(() => {
                /* A new scene interrupted this render. */
            });
    } else {
        renderActivePointAndCallout();
    }

    installTimelinePointer(
        xScale,
        yScale,
        margin,
        selectedDate
    );
}

function installTimelinePointer(
    xScale,
    yScale,
    margin,
    selectedDate
) {
    const interactiveRight =
        xScale(selectedDate);

    const focus =
        timelineSvg.append("g")
            .style(
                "display",
                "none"
            );

    focus.append("line")
        .attr(
            "y1",
            margin.top
        )
        .attr(
            "y2",
            T.height -
            margin.bottom
        )
        .attr(
            "stroke",
            "#5f6c78"
        )
        .attr(
            "stroke-dasharray",
            "3 3"
        );

    focus.append("circle")
        .attr(
            "r",
            5
        )
        .attr(
            "fill",
            "#07558a"
        )
        .attr(
            "stroke",
            "#ffffff"
        )
        .attr(
            "stroke-width",
            1.5
        );

    timelineSvg.append("rect")
        .attr(
            "x",
            margin.left
        )
        .attr(
            "y",
            margin.top
        )
        .attr(
            "width",
            Math.max(
                0,

                interactiveRight -
                margin.left
            )
        )
        .attr(
            "height",
            T.height -
            margin.top -
            margin.bottom
        )
        .attr(
            "fill",
            "transparent"
        )
        .style(
            "cursor",
            "crosshair"
        )
        .on(
            "pointerenter",

            () => {
                focus.style(
                    "display",
                    null
                );
            }
        )
        .on(
            "pointermove",

            event => {
                const [pointerX] =
                    d3.pointer(
                        event,
                        timelineSvg.node()
                    );

                const constrainedX =
                    Math.max(
                        margin.left,

                        Math.min(
                            pointerX,
                            interactiveRight
                        )
                    );

                const record =
                    findNearestNationalRecord(
                        xScale.invert(
                            constrainedX
                        )
                    );

                const pointX =
                    xScale(record.date);

                const pointY =
                    yScale(
                        record
                            .sevenDayAverage
                    );

                focus.select("line")
                    .attr(
                        "x1",
                        pointX
                    )
                    .attr(
                        "x2",
                        pointX
                    );

                focus.select("circle")
                    .attr(
                        "cx",
                        pointX
                    )
                    .attr(
                        "cy",
                        pointY
                    );

                showTooltip(
                    event,

                    `
                        <strong>
                            United States
                        </strong>

                        <div>
                            ${fullDateFormat(
                                record.date
                            )}
                        </div>

                        <div>
                            7-day average:
                            ${integerFormat(
                                Math.round(
                                    record
                                        .sevenDayAverage
                                )
                            )}
                            newly reported cases per day
                        </div>

                        <div>
                            Daily reported increase:
                            ${integerFormat(
                                record.newCases
                            )}
                        </div>
                    `
                );
            }
        )
        .on(
            "pointerleave",

            () => {
                focus.style(
                    "display",
                    "none"
                );

                hideTooltip();
            }
        );
}

/* -------------------------------------------------------
   Map
------------------------------------------------------- */

function drawMap(
    scene,
    previousScene,
    animate,
    renderId
) {
    /*
     * Interrupt only the named map-color transition from an older
     * scene. Hover handlers never interrupt this transition.
     */
    mapSvg
        .selectAll("path.state")
        .interrupt("map-fill");

    mapSvg
        .selectAll("*")
        .remove();

    const currentRecords =
        mapRecordsByScene.get(
            scene.id
        ) || [];

    const previousRecords =
        mapRecordsByScene.get(
            previousScene.id
        ) || [];

    const currentLookup =
        new Map(
            currentRecords.map(
                record => [
                    record.fips,
                    record
                ]
            )
        );

    const previousLookup =
        new Map(
            previousRecords.map(
                record => [
                    record.fips,
                    record
                ]
            )
        );

    const stateFeatures =
        topojson.feature(
            topology,
            topology.objects.states
        ).features;

    const nationFeature =
        topojson.feature(
            topology,
            topology.objects.nation
        );

    const stateBoundaries =
        topojson.mesh(
            topology,
            topology.objects.states,

            (a, b) =>
                a !== b
        );

    const path =
        d3.geoPath();

    const topState =
        d3.greatest(
            currentRecords.filter(
                record =>
                    record.state !==
                    "District of Columbia"
            ),

            record =>
                record.casesPer100k
        );

    const transform =
        `translate(${M.x},${M.y}) ` +
        `scale(${M.scale})`;

    const stateLayer =
        mapSvg.append("g")
            .attr(
                "transform",
                transform
            );

    const boundaryLayer =
        mapSvg.append("g")
            .attr(
                "transform",
                transform
            );

    const emphasisLayer =
        mapSvg.append("g")
            .attr(
                "transform",
                transform
            );

    const calloutLayer =
        mapSvg.append("g");

    /*
     * This remains false until the scene's map transition completes
     * and its permanent annotation has been drawn.
     */
    let annotationVisible = false;

    const states =
        stateLayer
            .selectAll("path.state")
            .data(
                stateFeatures,
                feature =>
                    feature.id
            )
            .join("path")
            .attr(
                "class",
                "state"
            )
            .attr(
                "d",
                path
            )

            /*
             * Prevent mouse clicks from giving an SVG path keyboard
             * focus or creating the browser's black focus rectangle.
             */
            .attr(
                "tabindex",
                null
            )
            .attr(
                "focusable",
                "false"
            )
            .style(
                "outline",
                "none"
            )
            .style(
                "-webkit-tap-highlight-color",
                "transparent"
            )

            .attr(
                "fill",

                feature => {
                    const fips =
                        String(feature.id)
                            .padStart(
                                2,
                                "0"
                            );

                    const startingRecord =
                        animate
                            ? previousLookup.get(
                                fips
                            )
                            : currentLookup.get(
                                fips
                            );

                    return startingRecord
                        ? mapColorScale(
                            startingRecord
                                .casesPer100k
                        )
                        : "#e8ebee";
                }
            )
            .attr(
                "stroke",
                "#ffffff"
            )
            .attr(
                "stroke-width",
                0.7
            )

            /*
             * Prevent a left mouse press from focusing or selecting
             * the state path.
             */
            .on(
                "pointerdown",

                function (event) {
                    if (event.button === 0) {
                        event.preventDefault();

                        if (
                            typeof this.blur ===
                            "function"
                        ) {
                            this.blur();
                        }
                    }
                }
            )

            /*
             * Clicking a state intentionally performs no action.
             */
            .on(
                "click",

                function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (
                        typeof this.blur ===
                        "function"
                    ) {
                        this.blur();
                    }
                }
            )

            /*
             * IMPORTANT:
             * Do not call .interrupt() here. Interrupting the state
             * would cancel mapTransition.end() and prevent the
             * annotation from being rendered.
             */
            .on(
                "pointerenter",

                function (
                    event,
                    feature
                ) {
                    const record =
                        getMapRecord(
                            feature,
                            currentLookup
                        );

                    if (!record) {
                        return;
                    }

                    d3.select(this)
                        .attr(
                            "stroke",
                            "#111111"
                        )
                        .attr(
                            "stroke-width",
                            4
                        );

                    showTooltip(
                        event,

                        `
                            <strong>
                                ${escapeHtml(
                                    record.state
                                )}
                            </strong>

                            <div>
                                Seven days ending
                                ${fullDateFormat(
                                    record.date
                                )}
                            </div>

                            <div>
                                Newly reported cases:
                                ${integerFormat(
                                    record.weeklyCases
                                )}
                            </div>

                            <div>
                                Cases per 100,000:
                                ${rateFormat(
                                    record.casesPer100k
                                )}
                            </div>

                            <div>
                                State population:
                                ${integerFormat(
                                    record.population
                                )}
                            </div>

                            <div>
                                Cumulative reported cases:
                                ${integerFormat(
                                    record.cumulativeCases
                                )}
                            </div>
                        `
                    );

                    boundaryLayer.raise();
                    emphasisLayer.raise();
                    calloutLayer.raise();
                }
            )
            .on(
                "pointermove",
                moveTooltip
            )
            .on(
                "pointerleave",

                function (
                    event,
                    feature
                ) {
                    const record =
                        getMapRecord(
                            feature,
                            currentLookup
                        );

                    const isAnnotatedState =
                        annotationVisible &&
                        record &&
                        topState &&
                        record.state ===
                        topState.state;

                    /*
                     * Before the annotation appears, all states return
                     * to the ordinary white border. Afterward, only
                     * the annotated state retains its dark outline.
                     */
                    d3.select(this)
                        .attr(
                            "stroke",
                            isAnnotatedState
                                ? "#182432"
                                : "#ffffff"
                        )
                        .attr(
                            "stroke-width",
                            isAnnotatedState
                                ? 2
                                : 0.7
                        );

                    hideTooltip();

                    boundaryLayer.raise();
                    emphasisLayer.raise();
                    calloutLayer.raise();
                }
            );

    /*
     * Only fill is animated. Hover changes stroke without conflicting
     * with the map's scene transition.
     */
    const mapTransition =
        states.transition("map-fill")
            .duration(
                animate
                    ? DURATION
                    : 0
            )
            .ease(
                d3.easeCubicInOut
            )
            .attr(
                "fill",

                feature => {
                    const record =
                        getMapRecord(
                            feature,
                            currentLookup
                        );

                    return record
                        ? mapColorScale(
                            record.casesPer100k
                        )
                        : "#e8ebee";
                }
            );

    boundaryLayer.append("path")
        .datum(stateBoundaries)
        .attr(
            "class",
            "state-boundaries"
        )
        .attr(
            "d",
            path
        );

    boundaryLayer.append("path")
        .datum(nationFeature)
        .attr(
            "class",
            "nation-boundary"
        )
        .attr(
            "d",
            path
        );

    function renderMapAnnotation() {
        if (
            renderId !==
            narrativeState.renderId ||
            !topState
        ) {
            return;
        }

        const targetFeature =
            stateFeatures.find(
                feature => {
                    const record =
                        getMapRecord(
                            feature,
                            currentLookup
                        );

                    return (
                        record?.state ===
                        topState.state
                    );
                }
            );

        if (!targetFeature) {
            return;
        }

        annotationVisible = true;

        /*
         * Apply the permanent outline only after the transition has
         * completed. This does not affect the fill transition.
         */
        states
            .filter(feature => {
                const record =
                    getMapRecord(
                        feature,
                        currentLookup
                    );

                return (
                    record?.state ===
                    topState.state
                );
            })
            .attr(
                "stroke",
                "#182432"
            )
            .attr(
                "stroke-width",
                2
            );

        const [
            originalX,
            originalY
        ] = path.centroid(
            targetFeature
        );

        const targetX =
            M.x +
            originalX *
            M.scale;

        const targetY =
            M.y +
            originalY *
            M.scale;

        const focusRing =
            emphasisLayer.append("circle")
                .attr(
                    "cx",
                    originalX
                )
                .attr(
                    "cy",
                    originalY
                )
                .attr(
                    "r",
                    animate
                        ? 4
                        : 22
                )
                .attr(
                    "opacity",
                    animate
                        ? 0
                        : 1
                )
                .attr(
                    "fill",
                    "none"
                )
                .attr(
                    "stroke",
                    "#182432"
                )
                .attr(
                    "stroke-width",
                    2
                )
                .attr(
                    "pointer-events",
                    "none"
                );

        if (animate) {
            focusRing.transition()
                .duration(
                    CALLOUT_FADE_DURATION
                )
                .attr(
                    "r",
                    22
                )
                .attr(
                    "opacity",
                    1
                );
        }

        drawCallout({
            layer:
                calloutLayer,

            targetX,
            targetY,

            configuration:
                M.callout,

            title:
                scene.mapAnnotationTitle,

            paragraph:
                `${topState.state} had approximately ` +
                `${rateFormat(
                    topState.casesPer100k
                )} newly reported cases per 100,000 residents ` +
                `during the seven days ending ` +
                `${fullDateFormat(
                    topState.date
                )}. ` +
                `${scene.mapAnnotationText}`,

            svgHeight:
                M.height,

            animate
        });

        boundaryLayer.raise();
        emphasisLayer.raise();
        calloutLayer.raise();
    }

    if (animate) {
        mapTransition.end()
            .then(
                renderMapAnnotation
            )
            .catch(error => {
                /*
                 * Hovering no longer reaches this branch. A rejection
                 * should now occur only when another scene replaces
                 * this render before its transition finishes.
                 */
                if (
                    renderId ===
                    narrativeState.renderId
                ) {
                    console.warn(
                        "Map transition was interrupted:",
                        error
                    );
                }
            });
    } else {
        renderMapAnnotation();
    }

    boundaryLayer.raise();
    emphasisLayer.raise();
    calloutLayer.raise();
}

function getMapRecord(
    feature,
    lookup
) {
    return lookup.get(
        String(feature.id)
            .padStart(
                2,
                "0"
            )
    );
}

/* -------------------------------------------------------
   Tooltips
------------------------------------------------------- */

function showTooltip(
    event,
    html
) {
    tooltip
        .attr(
            "hidden",
            null
        )
        .html(html);

    moveTooltip(event);
}

function moveTooltip(event) {
    const tooltipNode =
        tooltip.node();

    if (!tooltipNode) {
        return;
    }

    const offset = 14;

    let left =
        event.clientX +
        offset;

    let top =
        event.clientY +
        offset;

    if (
        left +
        tooltipNode.offsetWidth >
        window.innerWidth - 10
    ) {
        left =
            event.clientX -
            tooltipNode.offsetWidth -
            offset;
    }

    if (
        top +
        tooltipNode.offsetHeight >
        window.innerHeight - 10
    ) {
        top =
            event.clientY -
            tooltipNode.offsetHeight -
            offset;
    }

    tooltip
        .style(
            "left",
            `${left}px`
        )
        .style(
            "top",
            `${top}px`
        );
}

function hideTooltip() {
    tooltip.attr(
        "hidden",
        true
    );
}

function escapeHtml(value) {
    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

/* -------------------------------------------------------
   Loading and error states
------------------------------------------------------- */

function showLoadingState() {
    timelineSvg
        .selectAll("*")
        .remove();

    mapSvg
        .selectAll("*")
        .remove();

    timelineSvg.append("text")
        .attr(
            "x",
            T.width / 2
        )
        .attr(
            "y",
            T.height / 2
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Loading…"
        );

    mapSvg.append("text")
        .attr(
            "x",
            M.width / 2
        )
        .attr(
            "y",
            M.height / 2
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "Loading…"
        );
}

function showErrorState(message) {
    timelineSvg
        .selectAll("*")
        .remove();

    mapSvg
        .selectAll("*")
        .remove();

    timelineSvg.append("text")
        .attr(
            "x",
            T.width / 2
        )
        .attr(
            "y",
            T.height / 2 - 12
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .attr(
            "fill",
            "#a91f24"
        )
        .text(
            "Unable to load the visualization."
        );

    timelineSvg.append("text")
        .attr(
            "x",
            T.width / 2
        )
        .attr(
            "y",
            T.height / 2 + 17
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .attr(
            "fill",
            "#596878"
        )
        .attr(
            "font-size",
            13
        )
        .text(message);
}

init();