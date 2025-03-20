
import { useMemo } from 'react';

export const useChartConfig = () => {
  const chartConfig = useMemo(() => ({
    loans: { 
      label: "Emprunts", 
      theme: { light: "#8B5CF6", dark: "#A78BFA" }
    },
    returns: { 
      label: "Retours", 
      theme: { light: "#10B981", dark: "#34D399" }
    },
    roman: { 
      label: "Roman", 
      theme: { light: "#8B5CF6", dark: "#A78BFA" }
    },
    science: { 
      label: "Science", 
      theme: { light: "#EC4899", dark: "#F472B6" }
    },
    poesie: { 
      label: "Poésie", 
      theme: { light: "#10B981", dark: "#34D399" }
    },
    histoire: { 
      label: "Histoire", 
      theme: { light: "#F59E0B", dark: "#FBBF24" }
    },
    philosophie: { 
      label: "Philosophie", 
      theme: { light: "#EF4444", dark: "#F87171" }
    },
    autres: { 
      label: "Autres", 
      theme: { light: "#6366F1", dark: "#818CF8" }
    }
  }), []);

  const COLORS = ["#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

  return { chartConfig, COLORS };
};
