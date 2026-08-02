"use strict";

/*
 * Four Waves, Four Geographic Footprints
 *
 * Each scene combines:
 * 1. A national timeline showing the scale and timing of a surge.
 * 2. A state map showing the geographic footprint of that surge.
 * 3. A persistent callout with a leader line connecting the selected
 *    data point to a text block in a reserved right-side gutter.
 */

const ANIMATION_DURATION = 900;
const TEXT_TRANSITION_DELAY = 180;

/*
 * The plotted timeline ends before the right side of the SVG.
 * Everything after plotRight is reserved for the annotation.
 */
const TIMELINE_LAYOUT = {
    width: 760,
    height: 390,

    margin: {
        top: 42,
        right: 220,
        bottom: 56,
        left: 78
    },

    callout: {
        x: 570,
        centerY: 195,
        width: 165,
        padding: 11
    }
};

/*
 * The map is scaled and shifted left, leaving a permanent annotation
 * gutter on the right side of the 975 × 610 SVG.
 */
const MAP_LAYOUT = {
    width: 975,
    height: 610,

    x: 6,
    y: 68,
    scale: 0.72,

    callout: {
        x: 775,
        centerY: 305,
        width: 175,
        padding: 11
    }
};

const narrativeState = {
    currentScene: 0,
    previousScene: 0
};

let renderVersion = 0;

const scenes = [
    {
        id: "initial-wave",
        shortLabel: "Initial surge",

        title:
            "The first major surge was severe but geographically concentrated",

        sceneDate: "2020-04-10",
        windowDays: 21,

        summary:
            "The national line rose rapidly in spring 2020, but the map shows that this was not yet a uniformly national event. The highest recent reported case rates were concentrated in and around the Northeast.",

        context:
            "Community transmission was recognized in the United States by late February 2020. New York City then experienced a rapid increase in diagnosed cases and became the most visible center of the country's first major outbreak.",

        purpose:
            "This scene establishes the central argument: a national curve summarizes the scale of a surge, but it can conceal where the surge was concentrated.",

        lineAnnotationTitle:
            "The first national rise",

        lineAnnotationText:
            "Reported cases accelerated quickly, producing the first visible national surge.",

        mapAnnotationTitle:
            "A concentrated geographic footprint",

        mapAnnotationText:
            "The highest recent state rate shows that the first major U.S. surge was geographically concentrated rather than spread evenly across the country.",

        interactionText:
            "Hover over the timeline for national values or over a state for its seven-day reported case rate."
    },

    {
        id: "winter-wave",
        shortLabel: "Winter 2020–21",

        title:
            "The winter surge transformed COVID-19 into a broadly national crisis",

        sceneDate: "2021-01-08",
        windowDays: 28,

        summary:
            "The winter 2020–21 peak was much larger than the initial spring surge. Unlike the concentrated first wave, high recent case rates appeared across numerous parts of the country.",

        context:
            "By the end of 2020, sustained community transmission was occurring across the United States. The national seven-day average reached a major peak in January 2021, before vaccines were broadly available to the general public.",

        purpose:
            "This scene contrasts geographic concentration with geographic breadth. A national peak can represent a very different spatial pattern than an earlier surge.",

        lineAnnotationTitle:
            "A much larger national peak",

        lineAnnotationText:
            "The seven-day average reached a level far above the first spring surge.",

        mapAnnotationTitle:
            "The outbreak was no longer regional",

        mapAnnotationText:
            "High recent case rates were distributed much more broadly across the country than during the initial spring surge.",

        interactionText:
            "Compare this map with Scene 1. The projection, metric, and color scale remain unchanged."
    },

    {
        id: "delta-wave",
        shortLabel: "Delta",

        title:
            "The Delta surge rose during summer 2021 with another uneven footprint",

        sceneDate: "2021-09-01",
        windowDays: 28,

        summary:
            "Cases increased again during summer 2021 after falling sharply in the spring. The national curve identifies the resurgence, while the map reveals which states were experiencing the highest recent rates.",

        context:
            "The Delta variant rose to national predominance in late June 2021. Its greater transmissibility contributed to renewed case growth during the summer, although timing and intensity were not identical across states.",

        purpose:
            "This scene demonstrates that a national resurgence can be driven disproportionately by particular regions rather than increasing everywhere at exactly the same rate.",

        lineAnnotationTitle:
            "Cases rise again",

        lineAnnotationText:
            "The decline from winter reversed as the Delta period produced another major surge.",

        mapAnnotationTitle:
            "An uneven Delta footprint",

        mapAnnotationText:
            "The state-level rates identify where this stage of the Delta-period surge was most intense on the selected date.",

        interactionText:
            "Hover over states to compare recent rates rather than cumulative totals."
    },

    {
        id: "omicron-wave",
        shortLabel: "Omicron",

        title:
            "Omicron produced the sharpest and most synchronized case surge",

        sceneDate: "2022-01-10",
        windowDays: 24,

        summary:
            "The first Omicron surge produced the steepest rise and highest national case level in the visualization. The map shows how extensively high recent rates appeared across the country at the same time.",

        context:
            "Omicron was first identified in the United States in December 2021 and rapidly became predominant later that month. The transition was followed by a major increase in reported infections during December 2021 and January 2022.",

        purpose:
            "The final scene completes the comparison: the waves differed not only in height, but also in how broadly and simultaneously they affected the country.",

        lineAnnotationTitle:
            "The largest reported-case surge",

        lineAnnotationText:
            "The national seven-day average increased more sharply than during the earlier selected waves.",

        mapAnnotationTitle:
            "A broad national footprint",

        mapAnnotationText:
            "High seven-day reported case rates appeared across a much wider portion of the country at the same time.",

        interactionText:
            "Use the numbered controls or Previous to compare Omicron with earlier surges."
    }
];

const timelineSvg = d3.select("#timeline");
const mapSvg = d3.select("#map");

const parseDate = d3.timeParse("%Y-%m-%d");
const dateKeyFormat = d3.timeFormat("%Y-%m-%d");
const fullDateFormat = d3.timeFormat("%B %d, %Y");
const monthYearFormat = d3.timeFormat("%b %Y");

const compactNumberFormat = d3.format("~s");
const integerFormat = d3.format(",");
const rateFormat = d3.format(",.0f");

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
let usTopology = null;

let populationByFips = new Map();
let recordsByState = new Map();

let nationalSeries = [];
let stateWeeklyRateByScene = new Map();

let sharedMapColorScale = null;

/*
 * Parsing
 */

function parseCovidRow(row) {
    return {
        date: parseDate(row.date),
        dateString: row.date,
        state: row.state,

        fips: row.fips
            ? String(row.fips).padStart(2, "0")
            : null,

        cases: Number(row.cases),
        deaths: Number(row.deaths)
    };
}

function parsePopulationRow(row) {
    return {
        state: row.state,
        fips: String(row.fips).padStart(2, "0"),

        population2020Base:
            Number(row.population_2020_base),

        population2020:
            Number(row.population_2020),

        population2021:
            Number(row.population_2021),

        population2022:
            Number(row.population_2022),

        population2023:
            Number(row.population_2023),

        population2024:
            Number(row.population_2024),

        population2025:
            Number(row.population_2025)
    };
}

/*
 * Initialization
 */

async function init() {
    showLoadingState();

    try {
        [
            covidData,
            populationData,
            usTopology
        ] = await Promise.all([
            d3.csv(
                "data/us-states.csv",
                parseCovidRow
            ),

            d3.csv(
                "data/state_population_2020_2025.csv",
                parsePopulationRow
            ),

            d3.json(
                "data/states-albers-10m.json"
            )
        ]);

        validateLoadedData();

        populationByFips = new Map(
            populationData.map(record => [
                record.fips,
                record
            ])
        );

        prepareStateRecords();
        prepareNationalSeries();
        prepareSceneMapMetrics();
        createSharedMapScale();

        /*
         * The previous HTML annotation panels are no longer used.
         * Hide them in case they are still present in index.html.
         */
        d3.select("#timeline-annotation-panel")
            .style("display", "none");

        d3.select("#map-annotation-panel")
            .style("display", "none");

        installNavigationTriggers();

        renderScene({
            animate: false
        });
    } catch (error) {
        console.error(
            "Unable to initialize visualization:",
            error
        );

        showErrorState(
            "Confirm that the COVID, population, and TopoJSON files are inside the data folder."
        );
    }
}

function validateLoadedData() {
    if (!covidData.length) {
        throw new Error(
            "The COVID CSV is empty or unavailable."
        );
    }

    if (!populationData.length) {
        throw new Error(
            "The population CSV is empty or unavailable."
        );
    }

    if (
        !usTopology ||
        !usTopology.objects ||
        !usTopology.objects.states ||
        !usTopology.objects.nation
    ) {
        throw new Error(
            "The TopoJSON file does not contain the required geometry."
        );
    }
}

/*
 * Data preparation
 */

function getPopulationForYear(
    populationRecord,
    year
) {
    const propertyName =
        `population${year}`;

    const population =
        populationRecord[propertyName];

    if (Number.isFinite(population)) {
        return population;
    }

    return populationRecord.population2020Base;
}

function prepareStateRecords() {
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
}

function prepareNationalSeries() {
    const rowsByDate = d3.group(
        covidData.filter(record =>
            record.fips
        ),

        record =>
            record.dateString
    );

    nationalSeries = Array.from(
        rowsByDate,

        ([dateString, records]) => ({
            dateString,
            date: parseDate(dateString),

            cumulativeCases:
                d3.sum(
                    records,
                    record => record.cases
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

            const previous =
                nationalSeries[index - 1];

            record.newCases = Math.max(
                0,
                record.cumulativeCases -
                previous.cumulativeCases
            );
        }
    );

    nationalSeries.forEach(
        (record, index) => {
            const startIndex =
                Math.max(0, index - 6);

            record.sevenDayAverage =
                d3.mean(
                    nationalSeries.slice(
                        startIndex,
                        index + 1
                    ),

                    item => item.newCases
                );
        }
    );
}

function findStateRecordByDate(
    fips,
    dateString
) {
    const records =
        recordsByState.get(fips);

    if (!records) {
        return null;
    }

    return records.find(record =>
        record.dateString === dateString
    ) || null;
}

function calculateStateWeeklyRate(
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
        findStateRecordByDate(
            fips,
            sceneDateString
        );

    const startRecord =
        findStateRecordByDate(
            fips,
            dateKeyFormat(startDate)
        );

    if (!endRecord || !startRecord) {
        return null;
    }

    const populationRecord =
        populationByFips.get(fips);

    if (!populationRecord) {
        return null;
    }

    const population =
        getPopulationForYear(
            populationRecord,
            endDate.getFullYear()
        );

    if (
        !Number.isFinite(population) ||
        population <= 0
    ) {
        return null;
    }

    const weeklyCases = Math.max(
        0,
        endRecord.cases -
        startRecord.cases
    );

    return {
        state: endRecord.state,
        fips,

        date: endRecord.date,
        startDate,

        population,

        cumulativeCases:
            endRecord.cases,

        cumulativeDeaths:
            endRecord.deaths,

        weeklyCases,

        weeklyCasesPer100k:
            (
                weeklyCases /
                population
            ) * 100000
    };
}

function prepareSceneMapMetrics() {
    stateWeeklyRateByScene =
        new Map();

    scenes.forEach(scene => {
        const records = [];

        populationData.forEach(
            populationRecord => {
                const metric =
                    calculateStateWeeklyRate(
                        populationRecord.fips,
                        scene.sceneDate
                    );

                if (metric) {
                    records.push(metric);
                }
            }
        );

        stateWeeklyRateByScene.set(
            scene.id,
            records
        );
    });
}

function createSharedMapScale() {
    const allRecords =
        Array.from(
            stateWeeklyRateByScene.values()
        ).flat();

    const maximumRate =
        d3.max(
            allRecords,
            record =>
                record.weeklyCasesPer100k
        ) || 1;

    sharedMapColorScale =
        d3.scaleSequentialSqrt(
            [0, maximumRate],
            d3.interpolateOrRd
        );

    updateLegend();
}

function updateLegend() {
    const maximum =
        sharedMapColorScale.domain()[1];

    const positionScale =
        d3.scaleSqrt()
            .domain([0, maximum])
            .range([0, 1]);

    const values = [
        0,
        0.25,
        0.5,
        0.75,
        1
    ].map(position =>
        positionScale.invert(position)
    );

    d3.select("#legend-ticks")
        .selectAll("span")
        .data(values)
        .join("span")
        .text(value =>
            rateFormat(value)
        );
}

/*
 * Fixed NYT-style callout
 *
 * The leader line begins at a data point and ends at a text block in a
 * reserved right-side gutter. The callout's text box remains centered
 * vertically regardless of the selected scene.
 */

function wrapSvgText(
    textSelection,
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

    let tspan = textSelection
        .append("tspan")
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

            tspan = textSelection
                .append("tspan")
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
    container,
    className,
    targetX,
    targetY,
    calloutX,
    calloutCenterY,
    calloutWidth,
    svgHeight,
    title,
    paragraph
}) {
    container
        .selectAll("*")
        .remove();

    const outerGroup =
        container.append("g")
            .attr(
                "class",
                `${className} callout-enter`
            )
            .attr(
                "pointer-events",
                "none"
            );

    /*
     * Render the text at a temporary origin so its actual dimensions
     * can be measured before positioning it.
     */
    const textGroup =
        outerGroup.append("g")
            .attr(
                "class",
                "callout-text-group"
            );

    const titleText =
        textGroup.append("text")
            .attr(
                "class",
                "callout-title"
            )
            .attr("x", 0)
            .attr("y", 0)
            .attr(
                "font-family",
                "Arial, Helvetica, sans-serif"
            )
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
            calloutWidth,
            17
        );

    const paragraphY =
        titleLines * 17 + 10;

    const paragraphText =
        textGroup.append("text")
            .attr(
                "class",
                "callout-paragraph"
            )
            .attr("x", 0)
            .attr("y", paragraphY)
            .attr(
                "font-family",
                "Arial, Helvetica, sans-serif"
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
        calloutWidth,
        15
    );

    const textBounds =
        textGroup.node().getBBox();

    const boxPadding = 10;

    const boxWidth =
        calloutWidth +
        boxPadding * 2;

    const boxHeight =
        textBounds.height +
        boxPadding * 2;

    /*
     * Center the box vertically, then constrain it to remain inside
     * the SVG's visible area.
     */
    const minimumTop = 16;

    const maximumTop =
        svgHeight -
        boxHeight -
        16;

    const boxTop =
        Math.max(
            minimumTop,

            Math.min(
                calloutCenterY -
                boxHeight / 2,

                maximumTop
            )
        );

    const boxLeft =
        calloutX;

    textGroup.attr(
        "transform",
        `translate(${
            boxLeft +
            boxPadding
        },${
            boxTop +
            boxPadding -
            textBounds.y
        })`
    );

    /*
     * Draw a subtle rectangular note background.
     */
    outerGroup.insert(
        "rect",
        ".callout-text-group"
    )
        .attr(
            "class",
            "callout-background"
        )
        .attr(
            "x",
            boxLeft
        )
        .attr(
            "y",
            boxTop
        )
        .attr(
            "width",
            boxWidth
        )
        .attr(
            "height",
            boxHeight
        )
        .attr(
            "rx",
            2
        )
        .attr(
            "fill",
            "rgba(242, 245, 247, 0.98)"
        )
        .attr(
            "stroke",
            "#c8d0d8"
        )
        .attr(
            "stroke-width",
            1
        );

    const connectorEndX =
        boxLeft;

    const connectorEndY =
        boxTop +
        boxHeight / 2;

    /*
     * An angled leader line resembling the NYT example:
     * point → elbow → horizontal line into the text block.
     */
    const elbowX =
        Math.max(
            targetX + 25,
            connectorEndX - 60
        );

    outerGroup.insert(
        "path",
        ".callout-background"
    )
        .attr(
            "class",
            "callout-connector"
        )
        .attr(
            "d",
            [
                `M ${targetX} ${targetY}`,
                `L ${elbowX} ${connectorEndY}`,
                `L ${connectorEndX} ${connectorEndY}`
            ].join(" ")
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

    /*
     * A small gold point echoes the NYT annotation treatment.
     */
    outerGroup.insert(
        "circle",
        ".callout-background"
    )
        .attr(
            "class",
            "callout-target"
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
            "#d4b84f"
        )
        .attr(
            "fill-opacity",
            0.82
        )
        .attr(
            "stroke",
            "#ffffff"
        )
        .attr(
            "stroke-width",
            1.5
        );

    outerGroup.raise();
}

/*
 * Scene navigation
 */

function goToScene(nextSceneIndex) {
    if (
        nextSceneIndex < 0 ||
        nextSceneIndex >=
            scenes.length ||
        nextSceneIndex ===
            narrativeState.currentScene
    ) {
        return;
    }

    narrativeState.previousScene =
        narrativeState.currentScene;

    narrativeState.currentScene =
        nextSceneIndex;

    renderScene({
        animate: true
    });
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

function renderScene({
    animate = true
} = {}) {
    renderVersion += 1;

    timelineSvg
        .selectAll(
            ".loading-message, .error-message"
        )
        .remove();

    mapSvg
        .selectAll(
            ".loading-message, .error-message"
        )
        .remove();

    hideTooltip();

    const scene =
        scenes[
            narrativeState.currentScene
        ];

    const previousScene =
        scenes[
            narrativeState.previousScene
        ];

    updateNarrativeText(
        scene,
        animate
    );

    updateNavigationControls();

    renderTimeline(
        scene,
        previousScene,
        animate,
        renderVersion
    );

    renderMap(
        scene,
        animate
    );
}

function updateNarrativeText(
    scene,
    animate
) {
    const storyContent =
        d3.select("#story-content");

    const applyText = () => {
        d3.select("#scene-number")
            .text(
                `Scene ${
                    narrativeState.currentScene +
                    1
                } of ${scenes.length}`
            );

        d3.select("#scene-title")
            .text(scene.title);

        d3.select("#scene-summary")
            .text(scene.summary);

        d3.select("#scene-context")
            .text(scene.context);

        d3.select("#scene-purpose")
            .text(scene.purpose);

        d3.select(
            "#interaction-instructions"
        ).text(
            scene.interactionText
        );

        d3.select(
            "#active-wave-label"
        ).text(
            `${scene.shortLabel}: ` +
            `${fullDateFormat(
                parseDate(
                    scene.sceneDate
                )
            )}`
        );

        d3.select("#map-date-label")
            .text(
                `Seven days ending ` +
                `${fullDateFormat(
                    parseDate(
                        scene.sceneDate
                    )
                )}`
            );

        storyContent
            .classed(
                "story-exit",
                false
            )
            .classed(
                "story-enter",
                true
            );

        window.setTimeout(() => {
            storyContent.classed(
                "story-enter",
                false
            );
        }, 520);
    };

    if (!animate) {
        applyText();
        return;
    }

    storyContent.classed(
        "story-exit",
        true
    );

    window.setTimeout(
        applyText,
        TEXT_TRANSITION_DELAY
    );
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
            `Scene ${
                currentIndex + 1
            } of ${scenes.length}`
        );

    d3.selectAll(".scene-button")
        .classed(
            "active",

            function () {
                return Number(
                    this.dataset.sceneIndex
                ) === currentIndex;
            }
        )
        .attr(
            "aria-current",

            function () {
                return Number(
                    this.dataset.sceneIndex
                ) === currentIndex
                    ? "step"
                    : null;
            }
        );
}

/*
 * Timeline rendering
 */

function renderTimeline(
    scene,
    previousScene,
    animate,
    currentRenderVersion
) {
    timelineSvg
        .interrupt()
        .selectAll("*")
        .interrupt();

    timelineSvg
        .selectAll("*")
        .remove();

    const {
        width,
        height,
        margin
    } = TIMELINE_LAYOUT;

    const plotRight =
        width -
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
                height - margin.bottom,
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
                height -
                margin.bottom
            )
            .y1(record =>
                yScale(
                    record.sevenDayAverage
                )
            );

    const selectedDate =
        parseDate(scene.sceneDate);

    const previousDate =
        parseDate(
            previousScene.sceneDate
        );

    const windowStart =
        d3.timeDay.offset(
            selectedDate,
            -scene.windowDays
        );

    const windowEnd =
        d3.timeDay.offset(
            selectedDate,
            scene.windowDays
        );

    timelineSvg.append("path")
        .datum(nationalSeries)
        .attr(
            "class",
            "timeline-future-line"
        )
        .attr(
            "d",
            lineGenerator
        );

    timelineSvg.append("rect")
        .attr(
            "class",
            "active-wave-window"
        )
        .attr(
            "x",
            xScale(windowStart)
        )
        .attr(
            "y",
            margin.top
        )
        .attr(
            "width",
            Math.max(
                0,

                xScale(windowEnd) -
                xScale(windowStart)
            )
        )
        .attr(
            "height",
            height -
            margin.top -
            margin.bottom
        )
        .attr(
            "opacity",
            animate ? 0 : 1
        )
        .transition()
        .duration(
            animate
                ? ANIMATION_DURATION
                : 0
        )
        .attr(
            "opacity",
            1
        );

    timelineSvg.append("g")
        .attr("class", "grid")
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
        .attr("class", "axis")
        .attr(
            "transform",
            `translate(0,${
                height -
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
        .attr("class", "axis")
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
            `translate(20,${
                height / 2
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
        `timeline-progress-clip-${currentRenderVersion}`;

    const startClipX =
        animate
            ? xScale(previousDate)
            : xScale(selectedDate);

    const targetClipX =
        xScale(selectedDate);

    const clipRect =
        timelineSvg.append("defs")
            .append("clipPath")
            .attr("id", clipId)
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
                height -
                margin.top -
                margin.bottom +
                20
            )
            .attr(
                "width",
                Math.max(
                    0,

                    startClipX -
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

    clipRect.transition()
        .duration(
            animate
                ? ANIMATION_DURATION
                : 0
        )
        .ease(d3.easeCubicInOut)
        .attr(
            "width",
            Math.max(
                0,

                targetClipX -
                margin.left
            )
        );

    timelineSvg.append("line")
        .attr(
            "class",
            "active-wave-rule"
        )
        .attr(
            "x1",
            animate
                ? xScale(previousDate)
                : xScale(selectedDate)
        )
        .attr(
            "x2",
            animate
                ? xScale(previousDate)
                : xScale(selectedDate)
        )
        .attr(
            "y1",
            margin.top
        )
        .attr(
            "y2",
            height -
            margin.bottom
        )
        .transition()
        .duration(
            animate
                ? ANIMATION_DURATION
                : 0
        )
        .ease(d3.easeCubicInOut)
        .attr(
            "x1",
            xScale(selectedDate)
        )
        .attr(
            "x2",
            xScale(selectedDate)
        );

    renderWaveMarkers(
        xScale,
        yScale
    );

    renderTimelineCallout(
        scene,
        xScale,
        yScale
    );

    installTimelinePointer(
        xScale,
        yScale,
        margin,
        plotRight,
        height
    );
}

function renderWaveMarkers(
    xScale,
    yScale
) {
    const markerData =
        scenes.map(
            (wave, index) => ({
                ...wave,
                sceneIndex: index,

                record:
                    findClosestNationalRecord(
                        parseDate(
                            wave.sceneDate
                        )
                    )
            })
        );

    timelineSvg
        .selectAll(
            "circle.wave-marker"
        )
        .data(markerData)
        .join("circle")
        .attr(
            "class",
            marker => {
                const classes = [
                    "wave-marker"
                ];

                if (
                    marker.sceneIndex ===
                    narrativeState.currentScene
                ) {
                    classes.push(
                        "active"
                    );
                }

                if (
                    marker.sceneIndex >
                    narrativeState.currentScene
                ) {
                    classes.push(
                        "unreached"
                    );
                }

                return classes.join(" ");
            }
        )
        .attr(
            "r",
            marker =>
                marker.sceneIndex ===
                narrativeState.currentScene
                    ? 7
                    : 4
        )
        .attr(
            "cx",
            marker =>
                xScale(
                    marker.record.date
                )
        )
        .attr(
            "cy",
            marker =>
                yScale(
                    marker.record
                        .sevenDayAverage
                )
        );

    timelineSvg
        .selectAll(
            "text.wave-marker-label"
        )
        .data(markerData)
        .join("text")
        .attr(
            "class",
            marker => {
                const classes = [
                    "wave-marker-label"
                ];

                if (
                    marker.sceneIndex ===
                    narrativeState.currentScene
                ) {
                    classes.push(
                        "active"
                    );
                }

                if (
                    marker.sceneIndex >
                    narrativeState.currentScene
                ) {
                    classes.push(
                        "unreached"
                    );
                }

                return classes.join(" ");
            }
        )
        .attr(
            "x",
            marker =>
                xScale(
                    marker.record.date
                )
        )
        .attr(
            "y",
            marker =>
                yScale(
                    marker.record
                        .sevenDayAverage
                ) - 13
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(marker =>
            marker.shortLabel
        );
}

function findClosestNationalRecord(
    targetDate
) {
    const bisector =
        d3.bisector(
            record =>
                record.date
        ).center;

    const index =
        bisector(
            nationalSeries,
            targetDate
        );

    return nationalSeries[index];
}

function renderTimelineCallout(
    scene,
    xScale,
    yScale
) {
    const record =
        findClosestNationalRecord(
            parseDate(scene.sceneDate)
        );

    const layer =
        timelineSvg.append("g")
            .attr(
                "class",
                "timeline-callout-layer"
            );

    drawCallout({
        container: layer,
        className:
            "timeline-persistent-callout",

        targetX:
            xScale(record.date),

        targetY:
            yScale(
                record.sevenDayAverage
            ),

        calloutX:
            TIMELINE_LAYOUT.callout.x,

        calloutCenterY:
            TIMELINE_LAYOUT.callout
                .centerY,

        calloutWidth:
            TIMELINE_LAYOUT.callout
                .width,

        svgHeight:
            TIMELINE_LAYOUT.height,

        title:
            scene.lineAnnotationTitle,

        paragraph:
            `${scene.lineAnnotationText} ` +
            `On ${fullDateFormat(record.date)}, ` +
            `the national seven-day average was approximately ` +
            `${integerFormat(
                Math.round(
                    record.sevenDayAverage
                )
            )} newly reported cases per day.`
    });
}

function installTimelinePointer(
    xScale,
    yScale,
    margin,
    plotRight,
    height
) {
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
            height -
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
        .attr("r", 5)
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
            2
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
            plotRight -
            margin.left
        )
        .attr(
            "height",
            height -
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

                const record =
                    findClosestNationalRecord(
                        xScale.invert(
                            pointerX
                        )
                    );

                const x =
                    xScale(record.date);

                const y =
                    yScale(
                        record
                            .sevenDayAverage
                    );

                focus.select("line")
                    .attr("x1", x)
                    .attr("x2", x);

                focus.select("circle")
                    .attr("cx", x)
                    .attr("cy", y);

                showTimelineTooltip(
                    event,
                    record
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

/*
 * Map rendering
 */

function renderMap(
    scene,
    animate
) {
    mapSvg
        .selectAll("*")
        .interrupt();

    mapSvg
        .selectAll("*")
        .remove();

    const records =
        stateWeeklyRateByScene.get(
            scene.id
        ) || [];

    const recordsByFips =
        new Map(
            records.map(record => [
                record.fips,
                record
            ])
        );

    const stateFeatures =
        topojson.feature(
            usTopology,
            usTopology.objects.states
        ).features;

    const nationFeature =
        topojson.feature(
            usTopology,
            usTopology.objects.nation
        );

    const stateBoundaries =
        topojson.mesh(
            usTopology,
            usTopology.objects.states,

            (a, b) =>
                a !== b
        );

    const path =
        d3.geoPath();

    const topState =
        d3.greatest(
            records.filter(record =>
                record.state !==
                "District of Columbia"
            ),

            record =>
                record.weeklyCasesPer100k
        );

    const mapTransform =
        `translate(${MAP_LAYOUT.x},${MAP_LAYOUT.y}) ` +
        `scale(${MAP_LAYOUT.scale})`;

    const stateLayer =
        mapSvg.append("g")
            .attr(
                "class",
                "state-layer"
            )
            .attr(
                "transform",
                mapTransform
            );

    const boundaryLayer =
        mapSvg.append("g")
            .attr(
                "class",
                "boundary-layer"
            )
            .attr(
                "transform",
                mapTransform
            );

    const emphasisLayer =
        mapSvg.append("g")
            .attr(
                "class",
                "map-emphasis-layer"
            )
            .attr(
                "transform",
                mapTransform
            );

    const calloutLayer =
        mapSvg.append("g")
            .attr(
                "class",
                "map-callout-layer"
            );

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
            .attr(
                "tabindex",
                0
            )
            .attr(
                "fill",
                "#e8ebee"
            )
            .attr(
                "aria-label",

                feature => {
                    const record =
                        getMapRecord(
                            feature,
                            recordsByFips
                        );

                    return record
                        ? createMapAccessibleText(
                            record
                        )
                        : "No data available";
                }
            )
            .on(
                "pointerenter focus",

                function (
                    event,
                    feature
                ) {
                    const record =
                        getMapRecord(
                            feature,
                            recordsByFips
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

                    boundaryLayer.raise();
                    emphasisLayer.raise();
                    calloutLayer.raise();

                    showMapTooltip(
                        event,
                        record
                    );
                }
            )
            .on(
                "pointermove",

                event => {
                    moveTooltip(event);
                }
            )
            .on(
                "pointerleave blur",

                function (
                    event,
                    feature
                ) {
                    const record =
                        getMapRecord(
                            feature,
                            recordsByFips
                        );

                    const isTopState =
                        record &&
                        topState &&
                        record.state ===
                        topState.state;

                    d3.select(this)
                        .attr(
                            "stroke",
                            isTopState
                                ? "#111111"
                                : "#ffffff"
                        )
                        .attr(
                            "stroke-width",
                            isTopState
                                ? 3
                                : 0.7
                        );

                    boundaryLayer.raise();
                    emphasisLayer.raise();
                    calloutLayer.raise();

                    hideTooltip();
                }
            );

    states.transition()
        .duration(
            animate
                ? ANIMATION_DURATION
                : 0
        )
        .ease(d3.easeCubicInOut)
        .attr(
            "fill",

            feature => {
                const record =
                    getMapRecord(
                        feature,
                        recordsByFips
                    );

                return record
                    ? sharedMapColorScale(
                        record
                            .weeklyCasesPer100k
                    )
                    : "#e8ebee";
            }
        )
        .attr(
            "stroke",

            feature => {
                const record =
                    getMapRecord(
                        feature,
                        recordsByFips
                    );

                return (
                    record &&
                    topState &&
                    record.state ===
                    topState.state
                )
                    ? "#111111"
                    : "#ffffff";
            }
        )
        .attr(
            "stroke-width",

            feature => {
                const record =
                    getMapRecord(
                        feature,
                        recordsByFips
                    );

                return (
                    record &&
                    topState &&
                    record.state ===
                    topState.state
                )
                    ? 3
                    : 0.7;
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

    renderTopStateEmphasis(
        topState,
        stateFeatures,
        recordsByFips,
        path,
        emphasisLayer
    );

    renderMapCallout(
        scene,
        topState,
        stateFeatures,
        recordsByFips,
        path,
        calloutLayer
    );

    boundaryLayer.raise();
    emphasisLayer.raise();
    calloutLayer.raise();
}

function getMapRecord(
    feature,
    recordsByFips
) {
    return recordsByFips.get(
        String(feature.id)
            .padStart(2, "0")
    );
}

function renderTopStateEmphasis(
    topState,
    stateFeatures,
    recordsByFips,
    path,
    emphasisLayer
) {
    emphasisLayer
        .selectAll("*")
        .remove();

    if (!topState) {
        return;
    }

    const targetFeature =
        stateFeatures.find(feature => {
            const record =
                getMapRecord(
                    feature,
                    recordsByFips
                );

            return (
                record &&
                record.state ===
                topState.state
            );
        });

    if (!targetFeature) {
        return;
    }

    const [x, y] =
        path.centroid(
            targetFeature
        );

    emphasisLayer.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 22)
        .attr("fill", "none")
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
}

function renderMapCallout(
    scene,
    topState,
    stateFeatures,
    recordsByFips,
    path,
    calloutLayer
) {
    if (!topState) {
        return;
    }

    const targetFeature =
        stateFeatures.find(feature => {
            const record =
                getMapRecord(
                    feature,
                    recordsByFips
                );

            return (
                record &&
                record.state ===
                topState.state
            );
        });

    if (!targetFeature) {
        return;
    }

    const [
        originalX,
        originalY
    ] = path.centroid(
        targetFeature
    );

    /*
     * Convert the map centroid into the full SVG coordinate system
     * because the map itself has been translated and scaled.
     */
    const targetX =
        MAP_LAYOUT.x +
        originalX *
        MAP_LAYOUT.scale;

    const targetY =
        MAP_LAYOUT.y +
        originalY *
        MAP_LAYOUT.scale;

    drawCallout({
        container:
            calloutLayer,

        className:
            "map-persistent-callout",

        targetX,
        targetY,

        calloutX:
            MAP_LAYOUT.callout.x,

        calloutCenterY:
            MAP_LAYOUT.callout
                .centerY,

        calloutWidth:
            MAP_LAYOUT.callout
                .width,

        svgHeight:
            MAP_LAYOUT.height,

        title:
            scene.mapAnnotationTitle,

        paragraph:
            `${topState.state} had approximately ` +
            `${rateFormat(
                topState.weeklyCasesPer100k
            )} newly reported cases per 100,000 residents ` +
            `during the seven days ending ` +
            `${fullDateFormat(topState.date)}. ` +
            scene.mapAnnotationText
    });
}

/*
 * Tooltips
 */

function createMapAccessibleText(
    record
) {
    return (
        `${record.state}: ` +
        `${integerFormat(
            record.weeklyCases
        )} newly reported cases ` +
        `during the preceding seven days, or ` +
        `${rateFormat(
            record.weeklyCasesPer100k
        )} per 100,000 residents.`
    );
}

function showMapTooltip(
    event,
    record
) {
    tooltip
        .attr(
            "hidden",
            null
        )
        .html(`
            <strong>${escapeHtml(record.state)}</strong>

            <div>
                Seven days ending
                ${fullDateFormat(record.date)}
            </div>

            <div>
                Newly reported cases:
                ${integerFormat(record.weeklyCases)}
            </div>

            <div>
                Cases per 100,000:
                ${rateFormat(record.weeklyCasesPer100k)}
            </div>

            <div>
                Population estimate:
                ${integerFormat(record.population)}
            </div>

            <div>
                Cumulative cases:
                ${integerFormat(record.cumulativeCases)}
            </div>
        `);

    moveTooltip(event);
}

function showTimelineTooltip(
    event,
    record
) {
    tooltip
        .attr(
            "hidden",
            null
        )
        .html(`
            <strong>United States</strong>

            <div>
                ${fullDateFormat(record.date)}
            </div>

            <div>
                7-day average:
                ${integerFormat(
                    Math.round(
                        record.sevenDayAverage
                    )
                )}
                newly reported cases per day
            </div>

            <div>
                Daily reported increase:
                ${integerFormat(record.newCases)}
            </div>
        `);

    moveTooltip(event);
}

function moveTooltip(event) {
    const tooltipNode =
        tooltip.node();

    if (!tooltipNode) {
        return;
    }

    const offset = 14;

    const tooltipWidth =
        tooltipNode.offsetWidth;

    const tooltipHeight =
        tooltipNode.offsetHeight;

    let left =
        event.clientX +
        offset;

    let top =
        event.clientY +
        offset;

    if (
        left + tooltipWidth >
        window.innerWidth - 10
    ) {
        left =
            event.clientX -
            tooltipWidth -
            offset;
    }

    if (
        top + tooltipHeight >
        window.innerHeight - 10
    ) {
        top =
            event.clientY -
            tooltipHeight -
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

/*
 * Loading and error states
 */

function showLoadingState() {
    timelineSvg
        .selectAll("*")
        .remove();

    mapSvg
        .selectAll("*")
        .remove();

    timelineSvg.append("text")
        .attr(
            "class",
            "loading-message"
        )
        .attr("x", 380)
        .attr("y", 195)
        .text(
            "Loading national case data..."
        );

    mapSvg.append("text")
        .attr(
            "class",
            "loading-message"
        )
        .attr("x", 487.5)
        .attr("y", 305)
        .text(
            "Loading state case rates..."
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
            "class",
            "error-message"
        )
        .attr("x", 380)
        .attr("y", 180)
        .text(
            "Unable to load the visualization."
        );

    timelineSvg.append("text")
        .attr(
            "class",
            "loading-message"
        )
        .attr("x", 380)
        .attr("y", 215)
        .style(
            "font-size",
            "14px"
        )
        .text(message);
}

init();