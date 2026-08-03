"use strict";

// ==============================
// Configuration
// ==============================

const DURATION = 1100;
const CALLOUT_FADE_DURATION = 320;

const REGION_ORDER = ["Northeast", "Midwest", "South", "West"];

const REGION_BY_STATE = {
    Maine: "Northeast",
    "New Hampshire": "Northeast",
    Vermont: "Northeast",
    Massachusetts: "Northeast",
    Connecticut: "Northeast",
    "Rhode Island": "Northeast",
    "New Jersey": "Northeast",
    "New York": "Northeast",
    Pennsylvania: "Northeast",

    Ohio: "Midwest",
    Indiana: "Midwest",
    Illinois: "Midwest",
    Michigan: "Midwest",
    Wisconsin: "Midwest",
    Iowa: "Midwest",
    Kansas: "Midwest",
    Minnesota: "Midwest",
    Missouri: "Midwest",
    Nebraska: "Midwest",
    "North Dakota": "Midwest",
    "South Dakota": "Midwest",

    Delaware: "South",
    Florida: "South",
    Georgia: "South",
    Maryland: "South",
    "North Carolina": "South",
    "South Carolina": "South",
    Virginia: "South",
    "District of Columbia": "South",
    "West Virginia": "South",
    Alabama: "South",
    Kentucky: "South",
    Mississippi: "South",
    Tennessee: "South",
    Arkansas: "South",
    Louisiana: "South",
    Oklahoma: "South",
    Texas: "South",

    Arizona: "West",
    Colorado: "West",
    Idaho: "West",
    Montana: "West",
    Nevada: "West",
    "New Mexico": "West",
    Utah: "West",
    Wyoming: "West",
    Alaska: "West",
    California: "West",
    Hawaii: "West",
    Oregon: "West",
    Washington: "West"
};

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

// ==============================
// Scene definitions
// ==============================

const scenes = [
    {
        id: "initial",
        type: "wave",
        label: "Initial surge",
        date: "2020-04-10",
        days: 20,

        title: "The first “national” spike was mostly a Northeast emergency",

        summary:
            "The national line rises sharply, but the map shows that the early burden was concentrated in a limited part of the country. What appears to be one national event was initially driven disproportionately by a regional emergency, showing how a national total can hide the geography beneath it.",

        context:
            "Community transmission had already begun before widespread testing could fully detect it. Multiple introductions, limited early surveillance, and rapid spread in dense metropolitan areas allowed the outbreak to become severe before its geographic concentration was widely understood.",

        contextSourceLabel:
            "CDC: Geographic Differences in COVID-19 Cases, Deaths, and Incidence",

        contextSourceUrl:
            "https://www.cdc.gov/mmwr/volumes/69/wr/mm6933e2.htm",

        lineAnnotationTitle: "The outbreak became visible late",

        lineAnnotationText:
            "The first reported spike appeared only after community transmission was already underway.",

        regionMode: "leading",

        mapAnnotationTitle:
            "The early burden was regionally concentrated"
    },
    {
        id: "summer",
        type: "wave",
        label: "Summer 2020",
        date: "2020-07-23",
        days: 24,

        title: "The next rise came from somewhere else",

        summary:
            "The national line rises again, but this was not simply a continuation of the spring outbreak. By summer, the center of reported burden had moved away from its earlier regional concentration. A similar national curve was now representing a substantially different epidemic underneath it.",

        context:
            "CDC reporting documented a substantial decline in the median age of reported cases during this period. Reopening, mobility, social contact, local vulnerability, and uneven mitigation probably contributed in different combinations.",

        contextSourceLabel:
            "CDC: Geographic Differences in COVID-19 Cases, Deaths, and Incidence",

        contextSourceUrl:
            "https://www.cdc.gov/mmwr/volumes/69/wr/mm6933e2.htm",

        lineAnnotationTitle:
            "A similar rise with a different source",

        lineAnnotationText:
            "The second spike emerged from a different geographic and demographic pattern than the first.",

        regionMode: "topTwo",

        mapAnnotationTitle:
            "The center of burden moved"
    },
    {
        id: "winter",
        type: "wave",
        label: "Winter 2020–21",
        date: "2021-01-08",
        days: 28,

        title:
            "Winter was the first wave that truly matched the national curve",

        summary:
            "The earlier spikes had recognizable regional centers. By winter, high rates appeared across all four Census regions at the same time. The national line now more closely represented the geographic reality underneath it rather than mainly disguising one dominant regional outbreak.",

        context:
            "Widespread community transmission, increased indoor contact, holiday travel and gatherings, and transmission from people without symptoms created conditions for sustained growth across many regions. Alpha was only beginning to emerge and was not the sole explanation.",

        contextSourceLabel:
            "Peer-reviewed study: Spatial and temporal patterns of COVID-19 in the United States",

        contextSourceUrl:
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC9592548/",

        lineAnnotationTitle:
            "Scale and breadth increased together",

        lineAnnotationText:
            "The winter peak rose far above the earlier spikes and reflected widespread simultaneous transmission.",

        regionMode: "all",

        mapAnnotationTitle:
            "The outbreak became broadly national"
    },
    {
        id: "delta",
        type: "wave",
        label: "Delta",
        date: "2021-09-01",
        days: 27,

        title:
            "Delta spread nationally, but protection was local",

        summary:
            "Delta produced another visible national wave, yet the state map remained uneven. A common variant did not create an equal burden in every region. Variant biology helps explain why the national curve rose, while regional differences in protection and local conditions help explain where burden became greatest.",

        context:
            "Delta was more transmissible than earlier variants and became predominant during summer 2021. Vaccination coverage, prior immunity, behavior, and local conditions differed substantially among states and regions.",

        contextSourceLabel:
            "Peer-reviewed study: Spatial and temporal patterns of COVID-19 in the United States",

        contextSourceUrl:
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC9592548/",

        lineAnnotationTitle:
            "A more transmissible variant reversed the decline",

        lineAnnotationText:
            "The spring decline ended as Delta became predominant and reported cases accelerated again.",

        regionMode: "leading",

        mapAnnotationTitle:
            "A shared variant, an unequal regional burden"
    },
    {
        id: "omicron",
        type: "wave",
        label: "Omicron",
        date: "2022-01-10",
        days: 23,

        title:
            "Omicron briefly made the country look like one epidemic",

        summary:
            "Omicron produced both the sharpest national increase and one of the broadest simultaneous geographic burdens in the visualization. Unlike the earlier waves, the enormous national spike was not mainly hiding one regional center. Here, the line and the map tell nearly the same story.",

        context:
            "Omicron replaced Delta extraordinarily quickly in late 2021. Its rapid growth, immune escape, and high transmissibility produced a more synchronized increase than the earlier regionally staggered outbreaks.",

        contextSourceLabel:
            "Peer-reviewed study: Spatial and temporal patterns of COVID-19 in the United States",

        contextSourceUrl:
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC9592548/",

        lineAnnotationTitle:
            "Rapid replacement produced exceptional speed",

        lineAnnotationText:
            "Omicron became predominant in a matter of weeks, coinciding with the largest reported-case spike.",

        regionMode: "all",

        mapAnnotationTitle:
            "The broadest synchronized regional burden"
    },
    {
        id: "ba5",
        type: "wave",
        label: "BA.5",
        date: "2022-07-15",
        days: 30,

        title:
            "Later waves remained national, but their regional burden was still uneven",

        summary:
            "The summer 2022 rise appears smaller than the first Omicron peak, but the state map still shows meaningful burden across the country. The regional pattern remained uneven, demonstrating that a smaller national increase could still be experienced differently from one part of the country to another.",

        context:
            "Successive Omicron descendants, including BA.2 and BA.5, continued to replace one another. Changes in testing behavior and increased use of home tests also made officially reported cases less complete than they had been earlier in the pandemic.",

        contextSourceLabel:
            "Peer-reviewed study: Spatial and temporal patterns of COVID-19 in the United States",

        contextSourceUrl:
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC9592548/",

        lineAnnotationTitle:
            "A later wave with a smaller reported peak",

        lineAnnotationText:
            "BA.5 was associated with another national rise, although its reported peak was smaller than the first Omicron surge.",

        regionMode: "all",

        mapAnnotationTitle:
            "Recorded burden persisted across every region"
    },
    {
        id: "conclusion",
        type: "conclusion",
        label: "Conclusion",
        date: null,
        days: 0,

        title:
            "National trends hid a shifting regional story",

        summary:
            "Seen together, the selected spikes do not form one repeating geographic pattern. Regional burden changed across the pandemic, sometimes concentrating in particular parts of the country and sometimes becoming widespread across all four Census regions.",

        context:
            "The complete timeline allows comparison of national timing and reported scale, while the maps reveal how the geographic structure underneath those national totals changed.",

        contextSourceLabel:
            "Peer-reviewed study: Spatial and temporal patterns of COVID-19 in the United States",

        contextSourceUrl:
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC9592548/",

        lineAnnotationTitle:
            "The peaks did not mean the same thing",

        lineAnnotationText:
            "Each selected spike combined a different geographic pattern and level of regional synchronization.",

        mapAnnotationTitle:
            "No region defined every wave"
    }
];

const waveScenes = scenes.filter(scene => scene.type === "wave");

// ==============================
// Application state
// ==============================

const narrativeState = {
    currentScene: 0,
    previousScene: 0,
    renderId: 0
};

const timelineSvg = d3.select("#timeline");
const mapSvg = d3.select("#map");

const parseDate = d3.timeParse("%Y-%m-%d");
const dateKeyFormat = d3.timeFormat("%Y-%m-%d");
const fullDateFormat = d3.timeFormat("%B %d, %Y");
const monthYearFormat = d3.timeFormat("%b %Y");

const integerFormat = d3.format(",");
const rateFormat = d3.format(",.0f");
const oneDecimalFormat = d3.format(",.1f");
const compactNumberFormat = d3.format("~s");

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
let regionSummariesByScene = new Map();

let summaryMapRecords = [];
let regionWaveLeadership = [];

let mapColorScale;
let summaryColorScale;

// ==============================
// Initialization
// ==============================

// Loads the data, prepares the visualization, and renders the first scene.
async function init() {
    showLoadingState();

    try {
        [covidData, populationData, topology] = await Promise.all([
            d3.csv("data/us-states.csv", row => ({
                date: parseDate(row.date),
                dateString: row.date,
                state: row.state,
                fips: row.fips ? String(row.fips).padStart(2, "0") : null,
                cases: Number(row.cases),
                deaths: Number(row.deaths)
            })),

            d3.csv("data/state_population_2020_2025.csv", row => ({
                state: row.state,
                fips: String(row.fips).padStart(2, "0"),
                population2020Base: Number(row.population_2020_base),
                population2020: Number(row.population_2020),
                population2021: Number(row.population_2021),
                population2022: Number(row.population_2022),
                population2023: Number(row.population_2023),
                population2024: Number(row.population_2024),
                population2025: Number(row.population_2025)
            })),

            d3.json("data/states-albers-10m.json")
        ]);

        validateData();
        prepareData();
        updatePageTitle();
        prepareStoryLayout();
        moveSceneButtonsToTop();
        buildSceneButtons();
        installNavigationTriggers();
        renderScene(false);
    } catch (error) {
        console.error("Unable to initialize visualization:", error);
        showErrorState("Unable to load one or more data files.");
    }
}

// Confirms that the required data files contain the expected data.
function validateData() {
    if (!Array.isArray(covidData) || covidData.length === 0) {
        throw new Error("The COVID-19 data file is empty.");
    }

    if (!Array.isArray(populationData) || populationData.length === 0) {
        throw new Error("The population data file is empty.");
    }

    if (!topology?.objects?.states || !topology?.objects?.nation) {
        throw new Error("The TopoJSON file is missing the expected objects.");
    }
}

// ==============================
// Page layout
// ==============================

// Updates the page title and introductory sentence.
function updatePageTitle() {
    const title = document.querySelector(".site-header h1");
    const introduction = document.querySelector(".site-header .introduction");

    if (title) {
        title.textContent = "National COVID-19 Trends Hid a Shifting Regional Story";
    }

    if (introduction) {
        introduction.textContent =
            "State-level rates reveal that the burden repeatedly shifted between regions.";
    }

    document.title = "National COVID-19 Trends Hid a Shifting Regional Story";
}

// Updates the story panel and creates the context source element.
function prepareStoryLayout() {
    const contextBlock = document.querySelector(".context-block");
    const contextHeading = contextBlock?.querySelector("h3");
    const contextParagraph = document.querySelector("#scene-context");
    const purposeBlock = document.querySelector(".purpose-block");

    if (contextHeading) {
        contextHeading.textContent = "Context";
    }

    if (purposeBlock) {
        purposeBlock.hidden = true;
        purposeBlock.style.display = "none";
    }

    if (
        contextBlock &&
        contextParagraph &&
        !document.querySelector("#scene-context-source")
    ) {
        const sourceParagraph = document.createElement("p");

        sourceParagraph.id = "scene-context-source";
        sourceParagraph.className = "context-source";

        Object.assign(sourceParagraph.style, {
            margin: "10px 0 0 0",
            fontSize: "12px",
            lineHeight: "1.4",
            color: "#687580"
        });

        contextParagraph.insertAdjacentElement("afterend", sourceParagraph);
    }
}

// Displays the source link for the current scene.
function updateContextSource(scene) {
    const sourceElement = document.querySelector("#scene-context-source");

    if (!sourceElement) {
        return;
    }

    sourceElement.replaceChildren();

    if (!scene.contextSourceLabel || !scene.contextSourceUrl) {
        sourceElement.hidden = true;
        return;
    }

    sourceElement.hidden = false;

    const prefix = document.createElement("span");
    prefix.textContent = "Source: ";

    const link = document.createElement("a");
    link.href = scene.contextSourceUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = scene.contextSourceLabel;

    sourceElement.append(prefix, link);
}

// Moves the numbered scene buttons above the visualization.
function moveSceneButtonsToTop() {
    const scene = document.querySelector(".scene");
    const sceneLayout = document.querySelector(".scene-layout");
    const navigation = document.querySelector("#numbered-navigation");

    if (!scene || !sceneLayout || !navigation) {
        return;
    }

    scene.insertBefore(navigation, sceneLayout);
    navigation.setAttribute("aria-label", "Choose a scene");

    Object.assign(navigation.style, {
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        margin: "0 0 18px 0",
        padding: "0 0 12px 0",
        borderBottom: "1px solid #d4dce3"
    });
}

// ==============================
// Navigation
// ==============================

// Creates one numbered navigation button for each scene.
function buildSceneButtons() {
    const buttons = d3.select("#numbered-navigation")
        .selectAll("button")
        .data(scenes)
        .join("button")
        .attr("type", "button")
        .attr("class", "scene-button")
        .attr("data-scene-index", (scene, index) => index)
        .attr("aria-label", (scene, index) => `Scene ${index + 1}: ${scene.label}`)
        .text((scene, index) => index + 1);

    buttons.each(function() {
        Object.assign(this.style, {
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
            fontWeight: "400"
        });
    });
}

// Adds click triggers to the navigation controls.
function installNavigationTriggers() {
    d3.select("#previous-button").on("click", () => {
        goToScene(narrativeState.currentScene - 1);
    });

    d3.select("#next-button").on("click", () => {
        goToScene(narrativeState.currentScene + 1);
    });

    d3.selectAll(".scene-button").on("click", function() {
        goToScene(Number(this.dataset.sceneIndex));
    });
}

// Changes the current scene and redraws the visualization.
function goToScene(nextSceneIndex) {
    if (
        nextSceneIndex < 0 ||
        nextSceneIndex >= scenes.length ||
        nextSceneIndex === narrativeState.currentScene
    ) {
        return;
    }

    narrativeState.previousScene = narrativeState.currentScene;
    narrativeState.currentScene = nextSceneIndex;

    renderScene(true);
}

// Updates button states and the scene counter.
function updateNavigationControls() {
    const currentIndex = narrativeState.currentScene;

    d3.select("#previous-button").property("disabled", currentIndex === 0);
    d3.select("#next-button").property("disabled", currentIndex === scenes.length - 1);

    d3.select("#navigation-status")
        .text(`Scene ${currentIndex + 1} of ${scenes.length}`);

    d3.selectAll(".scene-button")
        .classed("active", function() {
            return Number(this.dataset.sceneIndex) === currentIndex;
        })
        .attr("aria-current", function() {
            return Number(this.dataset.sceneIndex) === currentIndex ? "step" : null;
        })
        .each(function() {
            const isActive = Number(this.dataset.sceneIndex) === currentIndex;

            Object.assign(this.style, {
                color: isActive ? "#ffffff" : "#374958",
                background: isActive ? "#6d6d6d" : "#ffffff",
                border: "1px solid #aab3ba"
            });
        });
}

// ==============================
// Data preparation
// ==============================

// Prepares all derived data used by the timeline and maps.
function prepareData() {
    populationByFips = new Map(
        populationData.map(record => [record.fips, record])
    );

    recordsByState = d3.group(
        covidData.filter(record => record.fips),
        record => record.fips
    );

    recordsByState.forEach(records => {
        records.sort((a, b) => d3.ascending(a.date, b.date));
    });

    prepareNationalSeries();
    prepareWaveMapRecords();
    prepareRegionSummaries();
    prepareWaveMapColorScale();
    prepareSummaryMapRecords();
}

// Builds the national daily and seven-day-average case series.
function prepareNationalSeries() {
    const recordsByDate = d3.group(
        covidData.filter(record => record.fips),
        record => record.dateString
    );

    nationalSeries = Array.from(recordsByDate, ([dateString, records]) => ({
        dateString,
        date: parseDate(dateString),
        cumulativeCases: d3.sum(records, record => record.cases)
    })).sort((a, b) => d3.ascending(a.date, b.date));

    nationalSeries.forEach((record, index) => {
        if (index === 0) {
            record.newCases = 0;
            return;
        }

        record.newCases = Math.max(
            0,
            record.cumulativeCases - nationalSeries[index - 1].cumulativeCases
        );
    });

    nationalSeries.forEach((record, index) => {
        record.sevenDayAverage = d3.mean(
            nationalSeries.slice(Math.max(0, index - 6), index + 1),
            item => item.newCases
        );
    });
}

// Returns the best available population estimate for a year.
function getPopulationForYear(populationRecord, year) {
    const value = populationRecord[`population${year}`];

    if (Number.isFinite(value) && value > 0) {
        return value;
    }

    return populationRecord.population2020Base;
}

// Finds one state record for a specific date.
function findStateRecord(fips, dateString) {
    return recordsByState
        .get(fips)
        ?.find(record => record.dateString === dateString) || null;
}

// Calculates the seven-day state-level rate for one scene.
function calculateStateMetric(fips, sceneDateString) {
    const endDate = parseDate(sceneDateString);
    const startDate = d3.timeDay.offset(endDate, -7);

    const endRecord = findStateRecord(fips, sceneDateString);
    const startRecord = findStateRecord(fips, dateKeyFormat(startDate));
    const populationRecord = populationByFips.get(fips);

    if (!endRecord || !startRecord || !populationRecord) {
        return null;
    }

    const region = REGION_BY_STATE[endRecord.state];

    if (!region) {
        return null;
    }

    const population = getPopulationForYear(
        populationRecord,
        endDate.getFullYear()
    );

    const weeklyCases = Math.max(0, endRecord.cases - startRecord.cases);

    return {
        state: endRecord.state,
        region,
        fips,
        date: endRecord.date,
        population,
        weeklyCases,
        casesPer100k: (weeklyCases / population) * 100000,
        cumulativeCases: endRecord.cases,
        cumulativeDeaths: endRecord.deaths
    };
}

// Calculates the state-level map records for every wave scene.
function prepareWaveMapRecords() {
    mapRecordsByScene = new Map();

    waveScenes.forEach(scene => {
        const records = populationData
            .map(populationRecord => {
                return calculateStateMetric(populationRecord.fips, scene.date);
            })
            .filter(Boolean);

        mapRecordsByScene.set(scene.id, records);
    });
}

// Summarizes the state rates within each Census region.
function summarizeRegions(records) {
    const grouped = d3.group(records, record => record.region);

    const allRates = records
        .map(record => record.casesPer100k)
        .filter(Number.isFinite)
        .sort(d3.ascending);

    const topQuartileThreshold = d3.quantile(allRates, 0.75) || 0;

    return REGION_ORDER
        .map(region => {
            const regionRecords = grouped.get(region) || [];

            if (regionRecords.length === 0) {
                return null;
            }

            const topQuartileStates = regionRecords.filter(record => {
                return record.casesPer100k >= topQuartileThreshold;
            });

            return {
                region,
                medianRate: d3.median(
                    regionRecords,
                    record => record.casesPer100k
                ),
                meanRate: d3.mean(
                    regionRecords,
                    record => record.casesPer100k
                ),
                maximumRate: d3.max(
                    regionRecords,
                    record => record.casesPer100k
                ),
                minimumRate: d3.min(
                    regionRecords,
                    record => record.casesPer100k
                ),
                stateCount: regionRecords.length,
                topQuartileCount: topQuartileStates.length,
                topQuartileShare: topQuartileStates.length / regionRecords.length
            };
        })
        .filter(Boolean)
        .sort((a, b) => d3.descending(a.medianRate, b.medianRate));
}

// Calculates regional summaries and regional leaders for every wave.
function prepareRegionSummaries() {
    regionSummariesByScene = new Map();
    regionWaveLeadership = [];

    waveScenes.forEach(scene => {
        const records = mapRecordsByScene.get(scene.id) || [];
        const summaries = summarizeRegions(records);

        regionSummariesByScene.set(scene.id, summaries);

        if (summaries.length > 0) {
            regionWaveLeadership.push({
                sceneId: scene.id,
                label: scene.label,
                region: summaries[0].region,
                medianRate: summaries[0].medianRate
            });
        }
    });
}

// Creates the shared color scale for the wave maps.
function prepareWaveMapColorScale() {
    const allRecords = Array.from(mapRecordsByScene.values()).flat();

    const maximum = d3.max(
        allRecords,
        record => record.casesPer100k
    ) || 1;

    mapColorScale = d3.scaleSequentialSqrt(
        [0, maximum],
        d3.interpolateOrRd
    );
}

// Calculates how often each state appears in the highest-rate quartile.
function prepareSummaryMapRecords() {
    const summaryByFips = new Map();

    waveScenes.forEach(scene => {
        const sceneRecords = mapRecordsByScene.get(scene.id) || [];

        const validRates = sceneRecords
            .map(record => record.casesPer100k)
            .filter(Number.isFinite)
            .sort(d3.ascending);

        const threshold = d3.quantile(validRates, 0.75) || 0;

        sceneRecords.forEach(record => {
            if (!summaryByFips.has(record.fips)) {
                summaryByFips.set(record.fips, {
                    fips: record.fips,
                    state: record.state,
                    region: record.region,
                    population: record.population,
                    highBurdenWaves: 0,
                    totalSelectedWaves: waveScenes.length,
                    highestRate: 0,
                    highestRateScene: null,
                    ratesByScene: []
                });
            }

            const summary = summaryByFips.get(record.fips);

            summary.ratesByScene.push({
                sceneId: scene.id,
                label: scene.label,
                rate: record.casesPer100k
            });

            if (record.casesPer100k >= threshold) {
                summary.highBurdenWaves += 1;
            }

            if (record.casesPer100k > summary.highestRate) {
                summary.highestRate = record.casesPer100k;
                summary.highestRateScene = scene.label;
            }
        });
    });

    summaryMapRecords = Array.from(summaryByFips.values());

    const maximumCount = d3.max(
        summaryMapRecords,
        record => record.highBurdenWaves
    ) || 1;

    summaryColorScale = d3.scaleSequential(
        [0, maximumCount],
        d3.interpolateOrRd
    );
}

// ==============================
// Scene rendering
// ==============================

// Updates the text, navigation, timeline, and map for the current scene.
function renderScene(animate) {
    narrativeState.renderId += 1;

    const renderId = narrativeState.renderId;
    const scene = scenes[narrativeState.currentScene];
    const previousScene = scenes[narrativeState.previousScene];

    hideTooltip();
    updateStory(scene);
    updateNavigationControls();
    updatePanelHeadings(scene);
    updateLegend(scene);

    drawTimeline(scene, previousScene, animate, renderId);
    drawMap(scene, previousScene, animate, renderId);
}

// Updates the explanatory text for the current scene.
function updateStory(scene) {
    d3.select("#scene-number")
        .text(`Scene ${narrativeState.currentScene + 1} of ${scenes.length}`);

    d3.select("#scene-title").text(scene.title);
    d3.select("#scene-summary").text(scene.summary);
    d3.select("#scene-context").text(scene.context);
    d3.select("#scene-purpose").text("");

    updateContextSource(scene);

    d3.select("#interaction-instructions")
        .text(
            scene.type === "conclusion"
                ? "Hover over any marked wave or state to compare the complete story."
                : "Hover over the revealed timeline or a state for details."
        );

    d3.select("#active-wave-label")
        .text(
            scene.type === "conclusion"
                ? "All selected waves"
                : `${scene.label}: ${fullDateFormat(parseDate(scene.date))}`
        );

    d3.select("#map-date-label")
        .text(
            scene.type === "conclusion"
                ? "Number of selected waves in which each state was in the highest quartile of cases per 100,000"
                : `Seven days ending ${fullDateFormat(parseDate(scene.date))}`
        );
}

// Updates the timeline and map panel headings.
function updatePanelHeadings(scene) {
    const timelineHeading = document.querySelector("#timeline")
        ?.closest(".chart-panel")
        ?.querySelector(".panel-heading h3");

    const mapHeading = document.querySelector("#map")
        ?.closest(".chart-panel")
        ?.querySelector(".panel-heading h3");

    if (timelineHeading) {
        timelineHeading.textContent =
            scene.type === "conclusion"
                ? "The complete national reported-case timeline"
                : "National reported cases over time";
    }

    if (mapHeading) {
        mapHeading.textContent =
            scene.type === "conclusion"
                ? "Where high relative burden repeatedly appeared"
                : "State burden within Census regions";
    }
}

// Updates the map legend for wave or conclusion data.
function updateLegend(scene) {
    const legendTitle = document.querySelector(".legend-title");
    const legendGradient = document.querySelector(".legend-gradient");

    if (!legendTitle || !legendGradient) {
        return;
    }

    if (scene.type === "conclusion") {
        legendTitle.textContent = "High-burden selected waves";

        legendGradient.style.background =
            "linear-gradient(to right, #fff5eb, #fee6ce, #fdae6b, #e6550d, #a63603)";

        const maximumCount = d3.max(
            summaryMapRecords,
            record => record.highBurdenWaves
        ) || 1;

        d3.select("#legend-ticks")
            .selectAll("span")
            .data(d3.range(0, maximumCount + 1))
            .join("span")
            .text(value => value);

        return;
    }

    legendTitle.textContent = "7-day cases per 100,000";

    legendGradient.style.background =
        "linear-gradient(to right, #fff5eb, #fee6ce, #fdd0a2, #fdae6b, #fd8d3c, #e6550d, #a63603)";

    const maximum = d3.max(
        Array.from(mapRecordsByScene.values()).flat(),
        record => record.casesPer100k
    ) || 1;

    const legendScale = d3.scaleSqrt()
        .domain([0, maximum])
        .range([0, 1]);

    const legendValues = [0, 0.25, 0.5, 0.75, 1]
        .map(position => legendScale.invert(position));

    d3.select("#legend-ticks")
        .selectAll("span")
        .data(legendValues)
        .join("span")
        .text(rateFormat);
}

// ==============================
// Annotation helpers
// ==============================

// Finds the national record closest to a requested date.
function findNearestNationalRecord(targetDate) {
    const bisector = d3.bisector(record => record.date).center;
    return nationalSeries[bisector(nationalSeries, targetDate)];
}

// Wraps SVG text into multiple tspan lines.
function wrapSvgText(selection, text, width, lineHeight) {
    const words = String(text).trim().split(/\s+/);

    let line = [];
    let lineNumber = 0;

    let tspan = selection.append("tspan")
        .attr("x", 0)
        .attr("dy", 0);

    words.forEach(word => {
        line.push(word);
        tspan.text(line.join(" "));

        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));

            line = [word];
            lineNumber += 1;

            tspan = selection.append("tspan")
                .attr("x", 0)
                .attr("dy", lineHeight)
                .text(word);
        }
    });

    return lineNumber + 1;
}

// Draws a labeled annotation box connected to a data point.
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
    layer.selectAll("*").remove();

    const group = layer.append("g")
        .attr("pointer-events", "none")
        .attr("opacity", animate ? 0 : 1);

    const textGroup = group.append("g");

    const titleText = textGroup.append("text")
        .attr("font-size", 14)
        .attr("font-weight", 700)
        .attr("fill", "#182432");

    const titleLines = wrapSvgText(
        titleText,
        title,
        configuration.width,
        17
    );

    const paragraphText = textGroup.append("text")
        .attr("y", titleLines * 17 + 10)
        .attr("font-size", 12)
        .attr("fill", "#596878");

    wrapSvgText(
        paragraphText,
        paragraph,
        configuration.width,
        15
    );

    const bounds = textGroup.node().getBBox();
    const padding = 10;
    const boxHeight = bounds.height + padding * 2;

    const boxTop = Math.max(
        16,
        Math.min(
            configuration.centerY - boxHeight / 2,
            svgHeight - boxHeight - 16
        )
    );

    textGroup.attr(
        "transform",
        `translate(${configuration.x + padding},${boxTop + padding - bounds.y})`
    );

    group.insert("rect", "g")
        .attr("x", configuration.x)
        .attr("y", boxTop)
        .attr("width", configuration.width + padding * 2)
        .attr("height", boxHeight)
        .attr("fill", "rgba(241,244,246,.98)")
        .attr("stroke", "#c8d0d8");

    const connectorY = boxTop + boxHeight / 2;
    const elbowX = Math.max(targetX + 25, configuration.x - 58);

    group.insert("path", "rect")
        .attr(
            "d",
            `M ${targetX} ${targetY}
             L ${elbowX} ${connectorY}
             L ${configuration.x} ${connectorY}`
        )
        .attr("fill", "none")
        .attr("stroke", "#687580")
        .attr("stroke-width", 1.35);

    group.insert("circle", "rect")
        .attr("cx", targetX)
        .attr("cy", targetY)
        .attr("r", 6)
        .attr("fill", "#d4a24b")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5);

    if (animate) {
        group.transition()
            .duration(CALLOUT_FADE_DURATION)
            .attr("opacity", 1);
    }
}

// ==============================
// Timeline rendering
// ==============================

// Draws the national case timeline for the current scene.
function drawTimeline(scene, previousScene, animate, renderId) {
    timelineSvg.selectAll("*").interrupt();
    timelineSvg.selectAll("*").remove();

    const margin = T.margin;
    const plotRight = T.width - margin.right;

    const xScale = d3.scaleTime()
        .domain(d3.extent(nationalSeries, record => record.date))
        .range([margin.left, plotRight]);

    const yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(nationalSeries, record => record.sevenDayAverage) || 1
        ])
        .nice()
        .range([T.height - margin.bottom, margin.top]);

    const lineGenerator = d3.line()
        .defined(record => Number.isFinite(record.sevenDayAverage))
        .x(record => xScale(record.date))
        .y(record => yScale(record.sevenDayAverage));

    const areaGenerator = d3.area()
        .defined(record => Number.isFinite(record.sevenDayAverage))
        .x(record => xScale(record.date))
        .y0(T.height - margin.bottom)
        .y1(record => yScale(record.sevenDayAverage));

    const selectedDate = getSceneRevealDate(scene);
    const previousDate = getSceneRevealDate(previousScene);

    const selectedX = xScale(selectedDate);
    const previousX = xScale(previousDate);

    drawTimelineAxes(xScale, yScale, margin, plotRight);

    if (scene.type === "wave") {
        drawWaveWindow(scene, previousScene, animate, xScale, margin);
    }

    const clipId = `timeline-clip-${renderId}`;
    const initialRevealX = animate ? previousX : selectedX;

    const clipRectangle = timelineSvg.append("defs")
        .append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top - 10)
        .attr(
            "height",
            T.height - margin.top - margin.bottom + 20
        )
        .attr(
            "width",
            Math.max(0, initialRevealX - margin.left)
        );

    const progressiveLayer = timelineSvg.append("g")
        .attr("clip-path", `url(#${clipId})`);

    progressiveLayer.append("path")
        .datum(nationalSeries)
        .attr("class", "timeline-area")
        .attr("d", areaGenerator);

    progressiveLayer.append("path")
        .datum(nationalSeries)
        .attr("class", "timeline-line")
        .attr("d", lineGenerator);

    const revealTransition = clipRectangle.transition()
        .duration(animate ? DURATION : 0)
        .ease(d3.easeCubicInOut)
        .attr(
            "width",
            Math.max(0, selectedX - margin.left)
        );

    if (scene.type === "conclusion") {
        renderConclusionTimelineAfterReveal({
            scene,
            animate,
            renderId,
            revealTransition,
            xScale,
            yScale,
            margin
        });

        return;
    }

    renderWaveTimelineAfterReveal({
        scene,
        animate,
        renderId,
        revealTransition,
        xScale,
        yScale,
        margin,
        selectedDate,
        selectedX,
        previousX
    });
}

// Returns the final visible date for a scene.
function getSceneRevealDate(scene) {
    if (scene.type === "conclusion") {
        return nationalSeries[nationalSeries.length - 1].date;
    }

    return parseDate(scene.date);
}

// Draws the timeline axes, grid lines, and y-axis label.
function drawTimelineAxes(xScale, yScale, margin, plotRight) {
    timelineSvg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(yScale)
                .ticks(5)
                .tickSize(-(plotRight - margin.left))
                .tickFormat("")
        );

    timelineSvg.append("g")
        .attr("class", "axis")
        .attr(
            "transform",
            `translate(0,${T.height - margin.bottom})`
        )
        .call(
            d3.axisBottom(xScale)
                .ticks(d3.timeMonth.every(4))
                .tickFormat(monthYearFormat)
        );

    timelineSvg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(compactNumberFormat)
        );

    timelineSvg.append("text")
        .attr("class", "axis-label")
        .attr(
            "transform",
            `translate(22,${T.height / 2}) rotate(-90)`
        )
        .attr("text-anchor", "middle")
        .text("7-day average of newly reported cases");
}

// Draws the highlighted time window around the current wave.
function drawWaveWindow(scene, previousScene, animate, xScale, margin) {
    const selectedDate = parseDate(scene.date);

    const currentWindowStart = d3.timeDay.offset(
        selectedDate,
        -scene.days
    );

    const currentWindowEnd = d3.timeDay.offset(
        selectedDate,
        scene.days
    );

    let initialStart = currentWindowStart;
    let initialEnd = currentWindowEnd;

    if (animate && previousScene.type === "wave") {
        const previousDate = parseDate(previousScene.date);

        initialStart = d3.timeDay.offset(
            previousDate,
            -previousScene.days
        );

        initialEnd = d3.timeDay.offset(
            previousDate,
            previousScene.days
        );
    }

    const waveWindow = timelineSvg.append("rect")
        .attr("class", "active-wave-window")
        .attr("x", xScale(initialStart))
        .attr("y", margin.top)
        .attr(
            "width",
            Math.max(0, xScale(initialEnd) - xScale(initialStart))
        )
        .attr(
            "height",
            T.height - margin.top - margin.bottom
        );

    if (animate) {
        waveWindow.transition()
            .duration(DURATION)
            .ease(d3.easeCubicInOut)
            .attr("x", xScale(currentWindowStart))
            .attr(
                "width",
                Math.max(
                    0,
                    xScale(currentWindowEnd) - xScale(currentWindowStart)
                )
            );
    }
}

// Adds the selected wave marker and annotation after the line is revealed.
function renderWaveTimelineAfterReveal({
    scene,
    animate,
    renderId,
    revealTransition,
    xScale,
    yScale,
    margin,
    selectedDate,
    selectedX,
    previousX
}) {
    const activeRule = timelineSvg.append("line")
        .attr("class", "active-wave-rule")
        .attr("x1", animate ? previousX : selectedX)
        .attr("x2", animate ? previousX : selectedX)
        .attr("y1", margin.top)
        .attr("y2", T.height - margin.bottom)
        .attr("opacity", animate ? 0.65 : 1);

    const ruleTransition = activeRule.transition()
        .duration(animate ? DURATION : 0)
        .ease(d3.easeCubicInOut)
        .attr("x1", selectedX)
        .attr("x2", selectedX)
        .attr("opacity", 1);

    const pointLayer = timelineSvg.append("g");
    const calloutLayer = timelineSvg.append("g");

    const selectedRecord = findNearestNationalRecord(selectedDate);

    // Draws the active point and its timeline annotation.
    function renderAnnotation() {
        if (renderId !== narrativeState.renderId) {
            return;
        }

        pointLayer.append("circle")
            .attr("class", "wave-marker active")
            .attr("cx", xScale(selectedRecord.date))
            .attr("cy", yScale(selectedRecord.sevenDayAverage))
            .attr("r", animate ? 0 : 7)
            .attr("opacity", animate ? 0 : 1)
            .transition()
            .duration(animate ? CALLOUT_FADE_DURATION : 0)
            .attr("r", 7)
            .attr("opacity", 1);

        pointLayer.append("text")
            .attr("class", "wave-marker-label active")
            .attr("x", xScale(selectedRecord.date))
            .attr("y", yScale(selectedRecord.sevenDayAverage) - 14)
            .attr("text-anchor", "middle")
            .attr("opacity", animate ? 0 : 1)
            .text(scene.label)
            .transition()
            .duration(animate ? CALLOUT_FADE_DURATION : 0)
            .attr("opacity", 1);

        drawCallout({
            layer: calloutLayer,
            targetX: xScale(selectedRecord.date),
            targetY: yScale(selectedRecord.sevenDayAverage),
            configuration: T.callout,
            title: scene.lineAnnotationTitle,
            paragraph:
                `${scene.lineAnnotationText} ` +
                `On ${fullDateFormat(selectedRecord.date)}, the seven-day average was approximately ` +
                `${integerFormat(Math.round(selectedRecord.sevenDayAverage))} newly reported cases per day.`,
            svgHeight: T.height,
            animate
        });
    }

    if (animate) {
        Promise.all([
            revealTransition.end(),
            ruleTransition.end()
        ])
            .then(renderAnnotation)
            .catch(() => {});
    } else {
        renderAnnotation();
    }

    installTimelinePointer(
        xScale,
        yScale,
        margin,
        selectedDate
    );
}

// Adds all selected wave markers to the conclusion timeline.
function renderConclusionTimelineAfterReveal({
    scene,
    animate,
    renderId,
    revealTransition,
    xScale,
    yScale,
    margin
}) {
    const markerLayer = timelineSvg.append("g");
    const calloutLayer = timelineSvg.append("g");

    // Draws conclusion markers and the conclusion annotation.
    function renderConclusion() {
        if (renderId !== narrativeState.renderId) {
            return;
        }

        const waveRecords = waveScenes.map(wave => ({
            scene: wave,
            record: findNearestNationalRecord(parseDate(wave.date))
        }));

        markerLayer.selectAll("circle.conclusion-wave-marker")
            .data(waveRecords)
            .join("circle")
            .attr(
                "class",
                "wave-marker active conclusion-wave-marker"
            )
            .attr("cx", item => xScale(item.record.date))
            .attr("cy", item => yScale(item.record.sevenDayAverage))
            .attr("r", animate ? 0 : 5)
            .attr("opacity", animate ? 0 : 1)
            .transition()
            .duration(animate ? CALLOUT_FADE_DURATION : 0)
            .attr("r", 5)
            .attr("opacity", 1);

        markerLayer.selectAll("text.conclusion-wave-label")
            .data(waveRecords)
            .join("text")
            .attr(
                "class",
                "wave-marker-label active conclusion-wave-label"
            )
            .attr("x", item => xScale(item.record.date))
            .attr("y", item => yScale(item.record.sevenDayAverage) - 13)
            .attr("text-anchor", "middle")
            .attr("opacity", animate ? 0 : 1)
            .text(item => item.scene.label)
            .transition()
            .duration(animate ? CALLOUT_FADE_DURATION : 0)
            .attr("opacity", 1);

        const omicron = waveRecords.find(
            item => item.scene.id === "omicron"
        );

        drawCallout({
            layer: calloutLayer,
            targetX: xScale(omicron.record.date),
            targetY: yScale(omicron.record.sevenDayAverage),
            configuration: T.callout,
            title: scene.lineAnnotationTitle,
            paragraph: scene.lineAnnotationText,
            svgHeight: T.height,
            animate
        });

        installConclusionMarkerTooltips(markerLayer);
    }

    if (animate) {
        revealTransition.end()
            .then(renderConclusion)
            .catch(() => {});
    } else {
        renderConclusion();
    }

    installTimelinePointer(
        xScale,
        yScale,
        margin,
        nationalSeries[nationalSeries.length - 1].date
    );
}

// Adds tooltips to the wave markers in the conclusion scene.
function installConclusionMarkerTooltips(markerLayer) {
    markerLayer.selectAll("circle.conclusion-wave-marker")
        .style("pointer-events", "all")
        .on("pointerenter", function(event, item) {
            d3.select(this).attr("r", 8);

            showTooltip(
                event,
                `
                    <strong>${escapeHtml(item.scene.label)}</strong>
                    <div>${fullDateFormat(item.record.date)}</div>
                    <div>
                        7-day national average:
                        ${integerFormat(Math.round(item.record.sevenDayAverage))}
                    </div>
                    <div>${escapeHtml(item.scene.lineAnnotationText)}</div>
                `
            );
        })
        .on("pointermove", moveTooltip)
        .on("pointerleave", function() {
            d3.select(this).attr("r", 5);
            hideTooltip();
        });
}

// Adds hover interaction to the visible portion of the timeline.
function installTimelinePointer(xScale, yScale, margin, selectedDate) {
    const interactiveRight = xScale(selectedDate);

    const focus = timelineSvg.append("g")
        .style("display", "none");

    focus.append("line")
        .attr("y1", margin.top)
        .attr("y2", T.height - margin.bottom)
        .attr("stroke", "#5f6c78")
        .attr("stroke-dasharray", "3 3");

    focus.append("circle")
        .attr("r", 5)
        .attr("fill", "#07558a")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5);

    timelineSvg.append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr(
            "width",
            Math.max(0, interactiveRight - margin.left)
        )
        .attr(
            "height",
            T.height - margin.top - margin.bottom
        )
        .attr("fill", "transparent")
        .style("cursor", "crosshair")
        .on("pointerenter", () => {
            focus.style("display", null);
        })
        .on("pointermove", event => {
            const [pointerX] = d3.pointer(event, timelineSvg.node());

            const constrainedX = Math.max(
                margin.left,
                Math.min(pointerX, interactiveRight)
            );

            const record = findNearestNationalRecord(
                xScale.invert(constrainedX)
            );

            const pointX = xScale(record.date);
            const pointY = yScale(record.sevenDayAverage);

            focus.select("line")
                .attr("x1", pointX)
                .attr("x2", pointX);

            focus.select("circle")
                .attr("cx", pointX)
                .attr("cy", pointY);

            showTooltip(
                event,
                `
                    <strong>United States</strong>
                    <div>${fullDateFormat(record.date)}</div>
                    <div>
                        7-day average:
                        ${integerFormat(Math.round(record.sevenDayAverage))}
                        newly reported cases per day
                    </div>
                    <div>
                        Daily reported increase:
                        ${integerFormat(record.newCases)}
                    </div>
                `
            );
        })
        .on("pointerleave", () => {
            focus.style("display", "none");
            hideTooltip();
        });
}

// ==============================
// Map geometry
// ==============================

// Converts the TopoJSON objects into map features and boundaries.
function getMapGeometry() {
    const stateFeatures = topojson.feature(
        topology,
        topology.objects.states
    ).features;

    const nationFeature = topojson.feature(
        topology,
        topology.objects.nation
    );

    const stateBoundaries = topojson.mesh(
        topology,
        topology.objects.states,
        (a, b) => a !== b
    );

    return {
        stateFeatures,
        nationFeature,
        stateBoundaries,
        path: d3.geoPath()
    };
}

// Creates the map layers in their intended drawing order.
function createMapLayers() {
    const transform = `translate(${M.x},${M.y}) scale(${M.scale})`;

    return {
        stateLayer: mapSvg.append("g").attr("transform", transform),
        boundaryLayer: mapSvg.append("g").attr("transform", transform),
        regionLayer: mapSvg.append("g").attr("transform", transform),
        emphasisLayer: mapSvg.append("g").attr("transform", transform),
        calloutLayer: mapSvg.append("g")
    };
}

// Finds the original TopoJSON geometry for a state feature.
function getStateTopologyGeometry(feature) {
    return topology.objects.states.geometries.find(geometry => {
        return String(geometry.id).padStart(2, "0") === getFeatureFips(feature);
    });
}

// Merges the states belonging to one Census region.
function buildRegionGeometry(region, stateFeatures, lookup) {
    const geometries = stateFeatures
        .filter(feature => {
            const record = getMapRecord(feature, lookup);
            return record?.region === region;
        })
        .map(getStateTopologyGeometry)
        .filter(Boolean);

    if (geometries.length === 0) {
        return null;
    }

    return topojson.merge(topology, geometries);
}

// Returns the regions that should be highlighted for a scene.
function getRegionsForScene(scene, regionSummaries) {
    if (scene.regionMode === "all") {
        return REGION_ORDER.filter(region => {
            return regionSummaries.some(summary => summary.region === region);
        });
    }

    if (scene.regionMode === "topTwo") {
        return regionSummaries
            .slice(0, 2)
            .map(summary => summary.region);
    }

    return regionSummaries.length > 0
        ? [regionSummaries[0].region]
        : [];
}

// Draws regional outlines over the state-level heat map.
function drawRegionOutlines({
    layers,
    stateFeatures,
    lookup,
    path,
    highlightedRegions,
    animate
}) {
    const regionData = REGION_ORDER
        .map(region => ({
            region,
            geometry: buildRegionGeometry(
                region,
                stateFeatures,
                lookup
            )
        }))
        .filter(item => item.geometry);

    layers.regionLayer.selectAll("path.region-outline")
        .data(regionData, item => item.region)
        .join("path")
        .attr("class", "region-outline")
        .attr("d", item => path(item.geometry))
        .attr("fill", "none")
        .attr("stroke", item => {
            return highlightedRegions.includes(item.region)
                ? "#172b3a"
                : "#7d8b96";
        })
        .attr("stroke-width", item => {
            return highlightedRegions.includes(item.region)
                ? 3.2
                : 1.1;
        })
        .attr("stroke-opacity", item => {
            return highlightedRegions.includes(item.region)
                ? 1
                : 0.48;
        })
        .attr("stroke-linejoin", "round")
        .attr("pointer-events", "none")
        .attr("opacity", animate ? 0 : 1)
        .transition()
        .duration(animate ? CALLOUT_FADE_DURATION : 0)
        .attr("opacity", 1);
}

// Finds the visual center of the highlighted region or regions.
function getCombinedRegionTarget({
    highlightedRegions,
    stateFeatures,
    lookup,
    path
}) {
    const geometries = highlightedRegions
        .flatMap(region => {
            return stateFeatures
                .filter(feature => {
                    const record = getMapRecord(feature, lookup);
                    return record?.region === region;
                })
                .map(getStateTopologyGeometry);
        })
        .filter(Boolean);

    if (geometries.length === 0) {
        return null;
    }

    const merged = topojson.merge(topology, geometries);
    const [x, y] = path.centroid(merged);

    return {
        originalX: x,
        originalY: y,
        targetX: M.x + x * M.scale,
        targetY: M.y + y * M.scale
    };
}

// Calculates the coefficient of variation for a list of values.
function coefficientOfVariation(values) {
    const valid = values.filter(value => Number.isFinite(value));
    const mean = d3.mean(valid);

    if (!Number.isFinite(mean) || mean === 0) {
        return 0;
    }

    return (d3.deviation(valid) || 0) / mean;
}

// Creates the data-driven map annotation text for a wave.
function buildRegionalAnnotation(scene, regionSummaries, highlightedRegions) {
    const summaryByRegion = new Map(
        regionSummaries.map(summary => [summary.region, summary])
    );

    if (scene.regionMode === "leading") {
        const leading = summaryByRegion.get(highlightedRegions[0]);
        const second = regionSummaries[1];

        return (
            `${leading.region} had the highest regional median at approximately ` +
            `${rateFormat(leading.medianRate)} newly reported cases per 100,000. ` +
            (
                second
                    ? `The next-highest regional median was approximately ` +
                      `${rateFormat(second.medianRate)} in the ${second.region}.`
                    : ""
            )
        );
    }

    if (scene.regionMode === "topTwo") {
        const first = summaryByRegion.get(highlightedRegions[0]);
        const second = summaryByRegion.get(highlightedRegions[1]);

        const combinedTopQuartile =
            first.topQuartileCount + second.topQuartileCount;

        const totalTopQuartile = d3.sum(
            regionSummaries,
            summary => summary.topQuartileCount
        );

        return (
            `${first.region} and ${second.region} had the two highest regional median rates, ` +
            `at approximately ${rateFormat(first.medianRate)} and ` +
            `${rateFormat(second.medianRate)} per 100,000. Together they contained ` +
            `${combinedTopQuartile} of the ${totalTopQuartile} states in the national highest-rate quartile.`
        );
    }

    const regionalMedians = regionSummaries.map(
        summary => summary.medianRate
    );

    const highest = d3.max(regionalMedians) || 0;
    const lowest = d3.min(regionalMedians) || 0;
    const cv = coefficientOfVariation(regionalMedians);

    if (scene.id === "winter") {
        return (
            `All four Census regions had elevated recorded burden. Regional median rates ranged from approximately ` +
            `${rateFormat(lowest)} to ${rateFormat(highest)} cases per 100,000, showing that the selected winter spike was not confined to one region.`
        );
    }

    if (scene.id === "omicron") {
        return (
            `All four regions reached high median rates at the same time. Their regional coefficient of variation was ` +
            `${oneDecimalFormat(cv * 100)}%, indicating how closely regional burdens moved together during the selected Omicron spike.`
        );
    }

    return (
        `Recorded burden remained present across all four Census regions. Regional median rates ranged from approximately ` +
        `${rateFormat(lowest)} to ${rateFormat(highest)} cases per 100,000.`
    );
}

// Creates the regional annotation text for the conclusion scene.
function buildConclusionRegionalAnnotation() {
    const leadershipCounts = d3.rollups(
        regionWaveLeadership,
        values => values.length,
        item => item.region
    ).sort((a, b) => d3.descending(a[1], b[1]));

    const leadershipText = leadershipCounts
        .map(([region, count]) => {
            return `${region} led ${count} selected ${count === 1 ? "wave" : "waves"}`;
        })
        .join("; ");

    return (
        `${leadershipText}. No one Census region had the highest median state rate in every selected wave, ` +
        `confirming that the geographic center of recorded burden changed over time.`
    );
}

// ==============================
// Map rendering
// ==============================

// Draws either a wave map or the conclusion map.
function drawMap(scene, previousScene, animate, renderId) {
    if (scene.type === "conclusion") {
        drawConclusionMap(
            scene,
            previousScene,
            animate,
            renderId
        );

        return;
    }

    drawWaveMap(
        scene,
        previousScene,
        animate,
        renderId
    );
}

// Draws a state heat map with data-driven regional annotations.
function drawWaveMap(scene, previousScene, animate, renderId) {
    mapSvg.selectAll("path.state").interrupt("map-fill");
    mapSvg.selectAll("*").remove();

    const currentRecords = mapRecordsByScene.get(scene.id) || [];

    const previousRecords =
        previousScene.type === "wave"
            ? mapRecordsByScene.get(previousScene.id) || []
            : currentRecords;

    const currentLookup = new Map(
        currentRecords.map(record => [record.fips, record])
    );

    const previousLookup = new Map(
        previousRecords.map(record => [record.fips, record])
    );

    const regionSummaries = regionSummariesByScene.get(scene.id) || [];

    const highlightedRegions = getRegionsForScene(
        scene,
        regionSummaries
    );

    const {
        stateFeatures,
        nationFeature,
        stateBoundaries,
        path
    } = getMapGeometry();

    const layers = createMapLayers();

    const states = layers.stateLayer
        .selectAll("path.state")
        .data(stateFeatures, feature => feature.id)
        .join("path")
        .attr("class", "state")
        .attr("d", path)
        .call(disableStateClicking)
        .attr("fill", feature => {
            const fips = getFeatureFips(feature);

            const startingRecord = animate
                ? previousLookup.get(fips)
                : currentLookup.get(fips);

            return startingRecord
                ? mapColorScale(startingRecord.casesPer100k)
                : "#e8ebee";
        })
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.7)
        .on("pointerenter", function(event, feature) {
            const record = getMapRecord(feature, currentLookup);

            if (!record) {
                return;
            }

            d3.select(this)
                .attr("stroke", "#111111")
                .attr("stroke-width", 4);

            showTooltip(
                event,
                buildWaveMapTooltip(record, regionSummaries)
            );

            raiseMapLayers(layers);
        })
        .on("pointermove", moveTooltip)
        .on("pointerleave", function() {
            d3.select(this)
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 0.7);

            hideTooltip();
            raiseMapLayers(layers);
        });

    const mapTransition = states.transition("map-fill")
        .duration(animate ? DURATION : 0)
        .ease(d3.easeCubicInOut)
        .attr("fill", feature => {
            const record = getMapRecord(feature, currentLookup);

            return record
                ? mapColorScale(record.casesPer100k)
                : "#e8ebee";
        });

    drawMapBoundaries(
        layers,
        stateBoundaries,
        nationFeature,
        path
    );

    // Draws the regional outline and map annotation after the transition.
    function renderRegionalAnnotation() {
        if (renderId !== narrativeState.renderId) {
            return;
        }

        drawRegionOutlines({
            layers,
            stateFeatures,
            lookup: currentLookup,
            path,
            highlightedRegions,
            animate
        });

        const target = getCombinedRegionTarget({
            highlightedRegions,
            stateFeatures,
            lookup: currentLookup,
            path
        });

        if (!target) {
            return;
        }

        renderMapFocusRing(
            layers.emphasisLayer,
            target.originalX,
            target.originalY,
            animate
        );

        drawCallout({
            layer: layers.calloutLayer,
            targetX: target.targetX,
            targetY: target.targetY,
            configuration: M.callout,
            title: scene.mapAnnotationTitle,
            paragraph: buildRegionalAnnotation(
                scene,
                regionSummaries,
                highlightedRegions
            ),
            svgHeight: M.height,
            animate
        });

        raiseMapLayers(layers);
    }

    if (animate) {
        mapTransition.end()
            .then(renderRegionalAnnotation)
            .catch(() => {});
    } else {
        renderRegionalAnnotation();
    }

    raiseMapLayers(layers);
}

// Draws the repeated high-burden summary map for the conclusion.
function drawConclusionMap(scene, previousScene, animate, renderId) {
    mapSvg.selectAll("path.state").interrupt("map-fill");
    mapSvg.selectAll("*").remove();

    const summaryLookup = new Map(
        summaryMapRecords.map(record => [record.fips, record])
    );

    const previousRecords =
        previousScene.type === "wave"
            ? mapRecordsByScene.get(previousScene.id) || []
            : [];

    const previousLookup = new Map(
        previousRecords.map(record => [record.fips, record])
    );

    const {
        stateFeatures,
        nationFeature,
        stateBoundaries,
        path
    } = getMapGeometry();

    const layers = createMapLayers();

    const states = layers.stateLayer
        .selectAll("path.state")
        .data(stateFeatures, feature => feature.id)
        .join("path")
        .attr("class", "state")
        .attr("d", path)
        .call(disableStateClicking)
        .attr("fill", feature => {
            const fips = getFeatureFips(feature);

            if (animate && previousLookup.has(fips)) {
                return mapColorScale(
                    previousLookup.get(fips).casesPer100k
                );
            }

            const summary = summaryLookup.get(fips);

            return summary
                ? summaryColorScale(summary.highBurdenWaves)
                : "#e8ebee";
        })
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.7)
        .on("pointerenter", function(event, feature) {
            const record = getMapRecord(feature, summaryLookup);

            if (!record) {
                return;
            }

            d3.select(this)
                .attr("stroke", "#111111")
                .attr("stroke-width", 4);

            showTooltip(
                event,
                buildSummaryMapTooltip(record)
            );

            raiseMapLayers(layers);
        })
        .on("pointermove", moveTooltip)
        .on("pointerleave", function() {
            d3.select(this)
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 0.7);

            hideTooltip();
            raiseMapLayers(layers);
        });

    const mapTransition = states.transition("map-fill")
        .duration(animate ? DURATION : 0)
        .ease(d3.easeCubicInOut)
        .attr("fill", feature => {
            const record = getMapRecord(feature, summaryLookup);

            return record
                ? summaryColorScale(record.highBurdenWaves)
                : "#e8ebee";
        });

    drawMapBoundaries(
        layers,
        stateBoundaries,
        nationFeature,
        path
    );

    // Draws all region outlines and the conclusion map annotation.
    function renderConclusionAnnotation() {
        if (renderId !== narrativeState.renderId) {
            return;
        }

        const allRegions = [...REGION_ORDER];

        drawRegionOutlines({
            layers,
            stateFeatures,
            lookup: summaryLookup,
            path,
            highlightedRegions: allRegions,
            animate
        });

        const target = getCombinedRegionTarget({
            highlightedRegions: allRegions,
            stateFeatures,
            lookup: summaryLookup,
            path
        });

        if (!target) {
            return;
        }

        drawCallout({
            layer: layers.calloutLayer,
            targetX: target.targetX,
            targetY: target.targetY,
            configuration: M.callout,
            title: scene.mapAnnotationTitle,
            paragraph: buildConclusionRegionalAnnotation(),
            svgHeight: M.height,
            animate
        });

        raiseMapLayers(layers);
    }

    if (animate) {
        mapTransition.end()
            .then(renderConclusionAnnotation)
            .catch(() => {});
    } else {
        renderConclusionAnnotation();
    }

    raiseMapLayers(layers);
}

// Draws state and national boundary lines.
function drawMapBoundaries(
    layers,
    stateBoundaries,
    nationFeature,
    path
) {
    layers.boundaryLayer.append("path")
        .datum(stateBoundaries)
        .attr("class", "state-boundaries")
        .attr("d", path);

    layers.boundaryLayer.append("path")
        .datum(nationFeature)
        .attr("class", "nation-boundary")
        .attr("d", path);
}

// Restores the intended visual stacking order of the map layers.
function raiseMapLayers(layers) {
    layers.boundaryLayer.raise();
    layers.regionLayer.raise();
    layers.emphasisLayer.raise();
    layers.calloutLayer.raise();
}

// Draws a focus ring at the regional annotation target.
function renderMapFocusRing(emphasisLayer, x, y, animate) {
    const focusRing = emphasisLayer.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", animate ? 4 : 22)
        .attr("opacity", animate ? 0 : 1)
        .attr("fill", "none")
        .attr("stroke", "#182432")
        .attr("stroke-width", 2)
        .attr("pointer-events", "none");

    if (animate) {
        focusRing.transition()
            .duration(CALLOUT_FADE_DURATION)
            .attr("r", 22)
            .attr("opacity", 1);
    }
}

// Prevents map states from receiving click focus.
function disableStateClicking(selection) {
    selection
        .attr("tabindex", null)
        .attr("focusable", "false")
        .style("outline", "none")
        .style("-webkit-tap-highlight-color", "transparent")
        .on("pointerdown", function(event) {
            if (event.button === 0) {
                event.preventDefault();

                if (typeof this.blur === "function") {
                    this.blur();
                }
            }
        })
        .on("click", function(event) {
            event.preventDefault();
            event.stopPropagation();

            if (typeof this.blur === "function") {
                this.blur();
            }
        });
}

// Converts a state feature ID into a two-digit FIPS code.
function getFeatureFips(feature) {
    return String(feature.id).padStart(2, "0");
}

// Finds the data record associated with a state feature.
function getMapRecord(feature, lookup) {
    return lookup.get(getFeatureFips(feature));
}

// ==============================
// Tooltip content
// ==============================

// Builds the tooltip shown for a state in a wave scene.
function buildWaveMapTooltip(record, regionSummaries) {
    const regionSummary = regionSummaries.find(summary => {
        return summary.region === record.region;
    });

    return `
        <strong>${escapeHtml(record.state)}</strong>

        <div>
            Census region:
            ${escapeHtml(record.region)}
        </div>

        <div>
            Seven days ending
            ${fullDateFormat(record.date)}
        </div>

        <div>
            Newly reported cases:
            ${integerFormat(record.weeklyCases)}
        </div>

        <div>
            State cases per 100,000:
            ${rateFormat(record.casesPer100k)}
        </div>

        <div>
            ${escapeHtml(record.region)} regional median:
            ${
                regionSummary
                    ? rateFormat(regionSummary.medianRate)
                    : "Not available"
            }
        </div>

        <div>
            State population:
            ${integerFormat(record.population)}
        </div>

        <div>
            Cumulative reported cases:
            ${integerFormat(record.cumulativeCases)}
        </div>
    `;
}

// Builds the tooltip shown for a state in the conclusion scene.
function buildSummaryMapTooltip(record) {
    const sortedRates = [...record.ratesByScene]
        .sort((a, b) => d3.descending(a.rate, b.rate));

    const rateLines = sortedRates
        .map(item => {
            return `
                <div>
                    ${escapeHtml(item.label)}:
                    ${rateFormat(item.rate)}
                    per 100,000
                </div>
            `;
        })
        .join("");

    return `
        <strong>${escapeHtml(record.state)}</strong>

        <div>
            Census region:
            ${escapeHtml(record.region)}
        </div>

        <div>
            High-burden selected waves:
            ${record.highBurdenWaves}
            of
            ${record.totalSelectedWaves}
        </div>

        <div>
            Highest selected-wave rate:
            ${rateFormat(record.highestRate)}
            per 100,000
        </div>

        <div>
            Highest selected wave:
            ${escapeHtml(record.highestRateScene || "Not available")}
        </div>

        <div style="margin-top:6px;">
            <strong>Selected-wave rates</strong>
        </div>

        ${rateLines}
    `;
}

// ==============================
// Tooltip behavior
// ==============================

// Displays the tooltip and positions it near the pointer.
function showTooltip(event, html) {
    tooltip
        .attr("hidden", null)
        .html(html);

    moveTooltip(event);
}

// Moves the tooltip while keeping it inside the browser window.
function moveTooltip(event) {
    const tooltipNode = tooltip.node();

    if (!tooltipNode) {
        return;
    }

    const offset = 14;

    let left = event.clientX + offset;
    let top = event.clientY + offset;

    if (
        left + tooltipNode.offsetWidth >
        window.innerWidth - 10
    ) {
        left =
            event.clientX -
            tooltipNode.offsetWidth -
            offset;
    }

    if (
        top + tooltipNode.offsetHeight >
        window.innerHeight - 10
    ) {
        top =
            event.clientY -
            tooltipNode.offsetHeight -
            offset;
    }

    tooltip
        .style("left", `${left}px`)
        .style("top", `${top}px`);
}

// Hides the tooltip.
function hideTooltip() {
    tooltip.attr("hidden", true);
}

// Escapes dynamic values before placing them in tooltip HTML.
function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ==============================
// Loading and error states
// ==============================

// Displays temporary loading messages inside both SVG elements.
function showLoadingState() {
    timelineSvg.selectAll("*").remove();
    mapSvg.selectAll("*").remove();

    timelineSvg.append("text")
        .attr("x", T.width / 2)
        .attr("y", T.height / 2)
        .attr("text-anchor", "middle")
        .text("Loading…");

    mapSvg.append("text")
        .attr("x", M.width / 2)
        .attr("y", M.height / 2)
        .attr("text-anchor", "middle")
        .text("Loading…");
}

// Displays an error message when the data cannot be loaded.
function showErrorState(message) {
    timelineSvg.selectAll("*").remove();
    mapSvg.selectAll("*").remove();

    timelineSvg.append("text")
        .attr("x", T.width / 2)
        .attr("y", T.height / 2 - 12)
        .attr("text-anchor", "middle")
        .attr("fill", "#a91f24")
        .text("Unable to load the visualization.");

    timelineSvg.append("text")
        .attr("x", T.width / 2)
        .attr("y", T.height / 2 + 17)
        .attr("text-anchor", "middle")
        .attr("fill", "#596878")
        .attr("font-size", 13)
        .text(message);
}

// ==============================
// Start visualization
// ==============================

init();