import React from 'react';
import { View, Text } from 'react-native';
import { StackedBarChart,XAxis,YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

export default class ScreenChart extends React.PureComponent {
    constructor(props) {
      super(props)
    }

    render() {

      let keys = ['val1','val2'];
      let colors = ['#0f0', '#9f9'];
      let colors2 = ['#f0f','#f9f'];
      
      const charData = this.props.navigation.state.params;
      const data = charData.map(chartDataDate => {

        let d = {date : chartDataDate.date, val1:0, val2:0};
        
        chartDataDate.feeds.forEach(feed => {
          d.val1 += feed.aMilk;
          d.val2 += feed.mMilk;
        });
        d.sum = d.val1+d.val2;

        return d;
      });
      const data2 = charData.map(chartDataDate => {

        let d = {date : chartDataDate.date, val1:0, val2:0, sum:0};
        
        chartDataDate.feeds.forEach(feed => {
          d.val1 += feed.durationD;
          d.val2 += feed.durationG;
        });
        d.sum = d.val1+d.val2;

        return d;
      });

      const xAxisHeight = 30;

      return (
        <View style={{ flex: 1}}>
          <View style={{ flexDirection: 'row' }}>
            <Text>biberons (ml/J)</Text>
            <Text style={{backgroundColor:colors[0], paddingLeft:10}}>art.</Text>
            <Text style={{backgroundColor:colors[1], paddingLeft:10}}>mat.</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <YAxis
                data={data.map(v=>v.sum)}
                style={{ marginBottom: xAxisHeight }}
                svg={{fontSize: 10, fill: 'black'}}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <StackedBarChart
                  style={{flex: 1 }}
                  data={ data }
                  colors={ colors }
                  keys={ keys }
                  svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                  gridMin={0}
              >
                <Grid/>
              </StackedBarChart>
              <XAxis
                  data={data}
                  formatLabel={ (value, index) => (index-data.length+1)+ ' J' }
                  style={{ marginHorizontal: -10, height:xAxisHeight}}
                  contentInset={{ left: 10, right: 10 }}
                  svg={{ fontSize: 10, fill: 'black', rotation: 0 }}
              />
            </View>
          </View>          
          <View style={{ flexDirection: 'row'}}>
            <Text>seins (min/J)</Text>
            <Text style={{backgroundColor:colors2[0], paddingLeft:10}}>droit</Text>
            <Text style={{backgroundColor:colors2[1], paddingLeft:10}}>gauche</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
          <YAxis
              data={data2.map(v=>v.sum)}
              style={{ marginBottom: xAxisHeight }}
              svg={{fontSize: 10, fill: 'black'}}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <StackedBarChart
                style={{flex: 1 }}
                data={ data2 }
                colors={ colors2 }
                keys={ keys }
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                gridMin={0}
            >
              <Grid/>
            </StackedBarChart>
            <XAxis
                data={ data2 }
                formatLabel={ (value, index) => (index-data.length+1)+ ' J' }
                style={{ marginHorizontal: -10, height:xAxisHeight}}
                contentInset={{ left: 10, right: 10 }}
                svg={{ fontSize: 10, fill: 'black', rotation: 0 }}
            />
          </View>
        </View>
      </View>      
    )
  }
}
