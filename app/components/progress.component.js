import React from 'react';

class Progress extends React.Component {

	render() {

		return(

			<div className="progress">
				<span className="player__time-elapsed">{this.props.elapsed}</span>
					<progress
						value={this.props.position}
						max="1"
						onClick={this.props.handleProgress} />
				<span className="player__time-total">{this.props.total}</span>
			</div>
		)
	}
}

export default Progress