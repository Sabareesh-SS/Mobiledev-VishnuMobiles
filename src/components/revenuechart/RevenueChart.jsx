import React, { useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RevenueChart = ({ data }) => {
  const minColW = 50;
  const chartWBase = SCREEN_WIDTH - 48;
  const chartW = Math.max(chartWBase, data.length * minColW);
  const chartH = 160;
  const paddingLeft = 5;
  const paddingBottom = 24;
  const barAreaH = chartH - paddingBottom;
  const barCount = data.length;
  const groupW = (chartW - paddingLeft) / barCount;
  const barW = Math.min(groupW * 0.32, 18);
  
  // Calculate dynamic max value
  const dataMax = Math.max(...data.map(d => Math.max(d.sales, d.profit)));
  // Add 20% padding to maxVal and round it up to a nice number
  const maxVal = dataMax === 0 ? 100 : Math.ceil((dataMax * 1.2) / 10) * 10;
  
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);

  const handlePress = (idx) => {
    setSelectedBarIndex(idx === selectedBarIndex ? null : idx);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Svg width={chartW} height={chartH}>
        {/* Y-Axis Labels & Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
        const y = barAreaH - frac * barAreaH;
        return (
          <React.Fragment key={i}>
            {frac > 0 && (
              <Line
                x1={paddingLeft}
                y1={y}
                x2={chartW}
                y2={y}
                stroke="#E8EAF6"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            )}
          </React.Fragment>
        );
      })}

      {data.map((d, i) => {
        const cx = paddingLeft + i * groupW + groupW / 2;
        const salesH = (d.sales / maxVal) * barAreaH;
        const profitH = (d.profit / maxVal) * barAreaH;
        const isSelected = selectedBarIndex === i;

        return (
          <G key={d.label} onPress={() => handlePress(i)}>
            {/* Sales bar (back, lighter) */}
            <Rect
              x={cx - barW - 2}
              y={barAreaH - salesH}
              width={barW}
              height={salesH}
              rx={4}
              fill={isSelected ? "#9FA8DA" : "#C5CAE9"}
            />
            {/* Profit bar (front, solid) */}
            <Rect
              x={cx + 2}
              y={barAreaH - profitH}
              width={barW}
              height={profitH}
              rx={4}
              fill={isSelected ? "#304FFE" : "#3D5AFE"}
            />
            
            {/* Invisible large touch area for easier tapping */}
            <Rect
              x={cx - groupW / 2}
              y={0}
              width={groupW}
              height={barAreaH}
              fill="transparent"
            />

            {/* Label */}
            <SvgText
              x={cx}
              y={chartH - 4}
              fontSize={9}
              fill={isSelected ? "#1A1A2E" : "#8A9BB0"}
              textAnchor="middle"
              fontWeight={isSelected ? "800" : "600"}>
              {d.label}
            </SvgText>

            {/* Tooltip / Label */}
            {isSelected && (
              <G>
                {/* Tooltip Background */}
                <Rect 
                  x={cx -35} 
                  y={barAreaH - Math.max(salesH, profitH) - 30} 
                  width={60} 
                  height={24} 
                  rx={4} 
                  fill="#1A1A2E" 
                />
                <SvgText
                  x={cx -20}
                  y={barAreaH - Math.max(salesH, profitH) - 15}
                  fontSize={10}
                  fill="#FFFFFF"
                  textAnchor="middle"
                  fontWeight="bold">
                  S:{d.sales} P:{d.profit}
                </SvgText>
              </G>
            )}
          </G>
        );
      })}
      </Svg>
    </ScrollView>
  );
};

export default RevenueChart;
