<View
style={{
  position: 'absolute',
  right: 0,
  backgroundColor: Colors.transparent,
  padding: '1%'
}}
>
<ScrollView
  showsVerticalScrollIndicator={false}
  style={{
    height: Math.round(Dimensions.get('window').height) - 70
  }}
>
  <View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('OurSamaj', {
            banner_url: this.state.banner_paths.bn_samaj + '/',
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_samaj : null
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='center'
            style={Style.dashimage}
            source={{ uri: this.state.logourl + this.state.samaajlogo }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            We
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    {this.state.member_can_post === '1' ? (
      <View style={[Style.dashcard, { marginTop: 10 }]}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Addnewpost')
          }
        >
          <View style={{ alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={Style.dashimage}
              source={images.add_user}
            />
          </View>
          <View style={{ alignItems: 'center', }}>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={[Style.dashtext, { textAlign: 'center' }]}
            >
              Create Post
              </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : null}
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('MembersDetails', {
            banner_url: this.state.banner_paths.bn_member + '/',
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data
              .bn_registered_member : null
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.Family}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={[Style.dashtext, { textAlign: 'center' }]}
          >
            My Family
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Matrimony', {
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_matrimony : null,
            banner_url: this.state.banner_paths.bn_matrimony + '/'
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.matromoney}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={[Style.dashtext, { textAlign: 'center' }]}
          >
            Matrimony
            </Text>
        </View>
      </TouchableOpacity>
    </View>

    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TalentListByMember')
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.telent}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Telent
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('NewsList', {
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_news : null,
            banner_url: this.state.banner_paths.bn_news + '/'
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.news}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            News
            </Text>
        </View>
      </TouchableOpacity>
    </View>

    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('CircularList', {
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_circular : null,
            banner_url: this.state.banner_paths.bn_circular + '/'
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.circular}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Circulars
            </Text>
        </View>
      </TouchableOpacity>
    </View>

    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('BusinessInfo')
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.businessinfo}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={4}
            ellipsizeMode='tail'
            style={[Style.dashtext]}
          >
            Buz. Dir
            </Text>
        </View>
      </TouchableOpacity>
    </View>


    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Employment', {
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_employment : null,
            banner_url: this.state.banner_paths.bn_employment + '/',
            isProfessional: this.state.isProfessional
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.Employment}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Employment
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('EventLIst', {
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_event : null,
            banner_url: this.state.banner_paths.bn_event + '/'
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.events}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Events
            </Text>
        </View>
      </TouchableOpacity>
    </View>

    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('YojnaList', {
            banner_url: this.state.banner_paths.bn_member + '/',
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data
              .bn_registered_member : null
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.plan}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Yojna
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Gallery')}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.gallery}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Gallery
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    {/* 
      <View style={[Style.dashcard, { marginTop: 10 }]}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('PropertyList', {
              banner_image: this.state.banner_data.length>0?this.state.banner_data.bn_property:null,
              banner_url: this.state.banner_paths.bn_property + '/'
            })
          }
        >
          <View style={{ alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={Style.dashimage}
              source={images.property}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={Style.dashtext}
            >
              Property
            </Text>
          </View>
        </TouchableOpacity>
      </View> */}

    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Donor', {
            banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_donation : null,
            banner_url: this.state.banner_paths.bn_donation + '/'
          })
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.donors}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            Donors
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Suggestion')
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.suggestion}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={[Style.dashtext, { textAlign: 'center' }]}
          >
            Feedback
            </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={[Style.dashcard, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Faq')}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode='cover'
            style={Style.dashimage}
            source={images.faqs}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={Style.dashtext}
          >
            FAQ
            </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
  <View style={{ height: 70 }} />
</ScrollView>


</View>