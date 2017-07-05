import React from 'react';
import Axios from 'axios';
import Sound from 'react-sound';
import Search from '../components/search.component';
import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';


class AppContainer extends React.Component {

	constructor(props){
		super(props);
		this.client_id = 'S75DzVku5LDHMh0L2VyAT5SUhJjm651C';
		this.state = {
			track: {stream_url: '', title: '', artwork_url: ''},
			playStatus: Sound.status.STOPPED,
			elapsed: '00:00',
			total: '00:00',
			totalRaw: 0,
			position: 0,
			playFromPosition: 0,
			autoCompleteValue: '',
			tracks: []
		};
		this.handleSongFinished = this.handleSongFinished.bind(this);
    	this.handleSongPlaying = this.handleSongPlaying.bind(this);
    	this.handleSelect = this.handleSelect.bind(this);
    	this.handleChange = this.handleChange.bind(this);
    	this.togglePlay = this.togglePlay.bind(this);
    	this.forward = this.forward.bind(this);
    	this.backward = this.backward.bind(this);
    	this.stop = this.stop.bind(this);
    	this.randomTrack = this.randomTrack.bind(this);
    	this.handleProgress = this.handleProgress.bind(this);
	}

	componentDidMount() {
		this.randomTrack();
	}

	prepareUrl(url) {
		return `${url}?client_id=${this.client_id}`
	}

	handleSongPlaying(audio) {
		this.setState({ elapsed: this.formatMilliseconds(audio.position),
						total: this.formatMilliseconds(audio.duration),
						totalRaw: audio.duration,
						position: audio.position / audio.duration })
	}

	handleSongFinished() {
		this.randomTrack();
	}

	handleSelect(value, item) {
		this.setState({ autoCompleteValue: value, track: item});
	}

	handleChange(event, value) {
		this.setState({autoCompleteValue: event.target.value});
		let _this = this;

		Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
			.then(function (response) {
				_this.setState({tracks: response.data});
			})
			.catch(function (err) {
				console.log(err);
			 });
	}

	handleProgress(event) {
		const clickedSpot = event.nativeEvent.offsetX;
		const totalWidth = event.nativeEvent.target.clientWidth;
		this.setState({
			playFromPosition: (clickedSpot / totalWidth) * this.state.totalRaw,
			playStatus: Sound.status.PLAYING
		});
	}

	togglePlay() {

		if(this.state.playStatus === Sound.status.PLAYING){
			this.setState({playStatus: Sound.status.PAUSED})
		} else {
			this.setState({playStatus: Sound.status.PLAYING})
		}
	}

	forward() {
		this.setState({playFromPosition: this.state.playFromPosition+=1000*10});
	}

	backward() {
		this.setState({playFromPosition: this.state.playFromPosition-=1000*10});
	}

	stop() {
		this.setState({playStatus: Sound.status.STOPPED});
	}

	xlArtwork(url){
		return url.replace(/large/, 't500x500');
	}

	formatMilliseconds(milliseconds) {

		var hours = Math.floor(milliseconds / 3600000);
		milliseconds = milliseconds % 3600000;

		var minutes = Math.floor(milliseconds / 60000);
		milliseconds = milliseconds % 60000;

		var seconds = Math.floor(milliseconds / 1000);
		milliseconds = Math.floor(milliseconds % 1000);

		return (minutes < 10 ? '0' : '') + minutes + ':' +
		(seconds < 10 ? '0' : '') + seconds;
	}

	randomTrack() {
		let _this = this;

		Axios.get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
			.then(function (response) {
				const trackLength = response.data.tracks.length;
				const randomNumber = Math.floor((Math.random() * trackLength) + 1);
				_this.setState({track: response.data.tracks[randomNumber]});
			})
			.catch(function (err) {
				console.log(err);
			 });
	}

	render () {
		const artStyle = {
			width: '100%',
			height: '500px',
			backgroundImage: `linear-gradient(
			rgba(0, 0, 0, 0.7),
			rgba(0, 0, 0, 0.7)
		),   	url(${this.xlArtwork(this.state.track.artwork_url)})`

		}
		return (
			<div className="music_player" style={artStyle}>
				<Search
					clientId={this.state.client_id}
					autoCompleteValue={this.state.autoCompleteValue}
					tracks={this.state.tracks}
					handleSelect={this.handleSelect.bind(this)}
					handleChange={this.handleChange.bind(this)}/>
				<Details
					title={this.state.track.title}/>
				<Sound
					url={this.prepareUrl(this.state.track.stream_url)}
					playStatus={this.state.playStatus}
					onPlaying={this.handleSongPlaying.bind(this)}
					playFromPosition={this.state.playFromPosition}
					onFinishedPlaying={this.handleSongFinished.bind(this)}/>
				<Player
					togglePlay={this.togglePlay.bind(this)}
					stop={this.stop.bind(this)}
					playStatus={this.state.playStatus}
					forward={this.forward.bind(this)}
					backward={this.backward.bind(this)}
					random={this.randomTrack.bind(this)}/>
				<Progress
					elapsed={this.state.elapsed}
					total={this.state.total}
					position={this.state.position}
					handleProgress={this.handleProgress}/>
			</div>
		);
	}
}

export default AppContainer