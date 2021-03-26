 // renderFooter = () => {
  //   if (this.state.totalPage === this.state.pageNo) {
  //     return (
  //       <View>

  //       </View>
  //     )
  //   } else {
  //     var page = this.state.pageNo + 1
  //     console.log('check the page no', page)
  //     // console.log('check the page no',page)
  //     return (
  //       //Footer View with Load More button
  //       <View style={Style.footer}>
  //         <TouchableOpacity
  //           activeOpacity={0.9}
  //           onPress={async () => {
  //             await this.setState({ pageNo: page, bottomLoading: true })
  //             // this.getPostList(page)
  //           }}
  //           style={Style.Buttonback}>

  //           {this.state.bottomLoading ? (
  //             <ActivityIndicator
  //               color="white"
  //               style={{ marginLeft: 8 }} />
  //           ) : <Text style={Style.Textmainstyle}>Load More</Text>}
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  // };