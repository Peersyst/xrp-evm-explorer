import $ from "jquery";
import {
    Chart,
    Filler,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-luxon";
import humps from "humps";
import sassVariables from "../../css/export-vars-to-js.module.scss";
import { isDarkMode } from "../lib/dark_mode";

function getBalanceChartTextColor() {
    if (isDarkMode()) {
        return sassVariables.dashboardBannerChartAxisFontColorDarkTheme;
    } else {
        return sassVariables.dashboardBannerChartAxisFontColor;
    }
}

function getBalanceChartLineColor() {
    if (isDarkMode()) {
        return sassVariables.lineColorBalanceDarkTheme;
    } else {
        return sassVariables.lineColorBalance;
    }
}

function getBalanceChartBorderColor() {
    if (isDarkMode()) {
        return sassVariables.borderColorBalanceDarkTheme;
    } else {
        return sassVariables.borderColorBalance;
    }
}

Chart.defaults.font.family =
    'Nunito, "Helvetica Neue", Arial, sans-serif,"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
Chart.defaults.color = getBalanceChartTextColor();
Chart.defaults.borderColor = getBalanceChartBorderColor();
Chart.register(
    Filler,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip
);

export function createCoinBalanceHistoryChart(el) {
    const $chartContainer = $("[data-chart-container]");
    const $chartLoading = $("[data-chart-loading-message]");
    const $chartError = $("[data-chart-error-message]");
    const dataPath = el.dataset.coin_balance_history_data_path;

    $.getJSON(dataPath, { type: "JSON" })
        .done((data) => {
            $chartContainer.show();

            const coinBalanceHistoryData = humps
                .camelizeKeys(data)
                .map((balance) => ({
                    x: balance.date,
                    y: balance.value,
                }));

            let stepSize = 3;

            if (data.length > 1) {
                const diff = Math.abs(
                    new Date(data[data.length - 1].date) -
                        new Date(data[data.length - 2].date)
                );
                const periodInDays = diff / (1000 * 60 * 60 * 24);

                stepSize = periodInDays;
            }
            return new Chart(el, {
                type: "line",
                data: {
                    datasets: [
                        {
                            label: "coin balance",
                            data: coinBalanceHistoryData,
                            lineTension: 0,
                            cubicInterpolationMode: "monotone",
                            fill: true,
                            borderColor: getBalanceChartLineColor(),
                            backgroundColor: getBalanceChartLineColor(),
                        },
                    ],
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                interaction: {
                    intersect: false,
                    mode: "index",
                },
                options: {
                    scales: {
                        x: {
                            type: "time",
                            time: {
                                unit: "day",
                                tooltipFormat: "DD",
                                stepSize,
                            },
                        },
                        y: {
                            type: "linear",
                            ticks: {
                                beginAtZero: true,
                            },
                            title: {
                                display: true,
                                labelString: window.localized.Ether,
                            },
                        },
                    },
                },
            });
        })
        .fail(() => {
            $chartError.show();
        })
        .always(() => {
            $chartLoading.hide();
        });
}
