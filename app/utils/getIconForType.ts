export  default function getIconForType(tipo: string) {
    switch (tipo) {
        case "tabla":
            return "i-heroicons-table-cells";
        case "grafico":
            return "i-heroicons-chart-bar";
        case "estadistica":
            return "i-heroicons-calculator";
        default:
            return "i-heroicons-document";
    }
};