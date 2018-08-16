import React from 'react';
import { View } from 'react-native';
import { StackedBarChart,XAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

export default class ScreenChart extends React.PureComponent {
    constructor(props) {
      super(props)
    }

    render() {

      let keys = ['durD','durG', 'matMilk', 'artMilk'];
      let colors = ['#f0f','#f9f', '#f00', '#0f0'];
      
      const charData = this.props.navigation.state.params;
      const data = charData.map(chartDataDate => {

        let d = {date : chartDataDate.date, durD:0, durG:0, matMilk:0, artMilk:0};
        
        chartDataDate.feeds.forEach(feed => {
          d.durD += feed.durationD;
          d.durG += feed.durationG;
          d.artMilk += feed.aMilk;
          d.matMilk += feed.mMilk;
        });

        return d;
      });
      return (
        <View style={{ height: 300}}>
          <StackedBarChart
              style={{flex: 1 }}
              data={ data }
              colors={ colors }
              keys={ keys }
              svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
          >
            <Grid/>
          </StackedBarChart>
          <XAxis
                    data={ data }
                    formatLabel={ (value, index) => (index-data.length+1)+ ' J' }
                    style={{ marginHorizontal: -10}}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black', rotation: 0 }}
                />
        </View>          
      )
  }
}
