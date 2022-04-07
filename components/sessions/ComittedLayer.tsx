import { Badge, Button, Code, Description, Popover, Spacer, Tag, Tooltip } from "@geist-ui/core";
import { Mic, Music, MoreVertical, Trash2, Copy, Info, Cloud, PlayFill} from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";
import LayerInterface from "../../interfaces/models/LayerInterface";
import StagedLayerInterface from "../../interfaces/StagedLayerInterface";

interface ComittedLayerProps {
  layer: LayerInterface,
  timelineDuration: number,
  timelineWidth: number,
  duplicateComittedLayer: any,
  deleteComittedLayer: any
  updateTimelineBuffer: any
  deleteTimelineBuffer: any,
};

interface ComittedLayerState {
  tonePlayer: any|null,
  layerWidth: number,
};

class ComittedLayer extends React.Component<ComittedLayerProps, ComittedLayerState> {

  static SecondWidth: number = 50; // px (pixels-per-second)

  constructor(props:ComittedLayerProps) {
    super(props);
    this.state = {
      tonePlayer: null,
      layerWidth: (props.layer.duration - props.layer.trimmedStartDuration - props.layer.trimmedEndDuration) * ComittedLayer.SecondWidth,
    };
    this.handlePlayer = this.handlePlayer.bind(this);
    this.createTonePlayer = this.createTonePlayer.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.handleDuplicate = this.handleDuplicate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    // console.log('mounted comitted layer', this.props.layer.layerId);
    if (this.state.tonePlayer === null) {
      this.createTonePlayer(this.props.layer.fileName, this.props.layer.bucketUrl);
    }
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
  }

  createTonePlayer(fileName: string|null, bucketUrl: string|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
    let tonePlayer: Tone.Player | null = null;
    if (fileName !== null) {
      tonePlayer = new Tone.Player('../../' + fileName + '.mp3').toDestination();
    } else if (bucketUrl !== null) {
      tonePlayer = new Tone.Player(bucketUrl).toDestination();
    }
    if (tonePlayer === null) return;
    tonePlayer.buffer.onload = () => {
      if (tonePlayer === null) return;
      tonePlayer.reverse = this.props.layer.reversed;
      tonePlayer.fadeIn = this.props.layer.fadeInDuration;
      tonePlayer.fadeOut = this.props.layer.fadeOutDuration;
      tonePlayer.mute = this.props.layer.muted;
      tonePlayer.buffer = tonePlayer.buffer.slice(this.props.layer.trimmedStartDuration, this.props.layer.duration - this.props.layer.trimmedEndDuration);
      this.props.updateTimelineBuffer(this.props.layer, tonePlayer.buffer);
    }
    this.setState({
      tonePlayer: tonePlayer,
    })
  }

  getInfo() {
    return (
      <Description title="Layer Info" style={{padding: '0px 10px 0px 10px'}} content={
      <>
        <p>Name <Code>{this.props.layer.name}</Code></p>
        <p>Artist <Code>{this.props.layer.member.firstname}{' '}{this.props.layer.member.lastname}</Code></p>
        <p>Start Time <Code>{Math.round(this.props.layer.startTime * 100) / 100}s</Code></p>
        <p>Duration <Code>{Math.round((this.props.layer.duration - this.props.layer.trimmedStartDuration - this.props.layer.trimmedEndDuration) * 100) / 100}s</Code></p>
        <p>Fade In <Code>{Math.round((this.props.layer.fadeInDuration) * 100) / 100}s</Code></p>
        <p>Fade Out <Code>{Math.round((this.props.layer.fadeOutDuration) * 100) / 100}s</Code></p>
        <p>Reversed <Code>{this.props.layer.reversed ? 'True' : 'False'}</Code></p>
      </>
      }></Description>
    );
  };

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    if (this.state.tonePlayer.state === "started") this.state.tonePlayer.stop();
    else this.state.tonePlayer.start(0);
  };

  handleDuplicate() {
    const stagedLayer: StagedLayerInterface = {
      layer: JSON.parse(JSON.stringify(this.props.layer)),
      recordingId: null,
      recordingBlob: null,
    };
    this.props.duplicateComittedLayer(stagedLayer);
  };

  handleDelete() {
    this.props.deleteComittedLayer(this.props.layer);
  };

  render() {
    return (
      <div
        className="staged-layer" id={`comitted-layer-${this.props.layer.layerId}`} 
        style={{minWidth: `${this.state.layerWidth}px`, maxWidth: `${this.state.layerWidth}px`,
          transform: `translate(${this.props.layer.startTime * ComittedLayer.SecondWidth}px, ${this.props.layer.y}px)`,
      }}>
        <div className="comitted-layer-details">
          <div style={{display: 'flex', paddingLeft: '10px', paddingRight: '10px'}}>
            <Tooltip text={'In the cloud'} style={{display: 'flex'}}
              placement="top" type="dark">
              <Cloud/>
            </Tooltip>
          </div>
          <div className="staged-layer-wav"></div>
            
          <div>
            <Popover
              content={
                <>
                <Popover.Item title style={{justifyContent: 'center'}}>
                  {this.state.tonePlayer !== null && <Tooltip text={'Play'}
                    placement="top" type="dark">
                    <Button
                      iconRight={<PlayFill/>}
                      auto
                      type="secondary"
                      ghost
                      scale={2/3}
                      px={0.6}
                      onClick={this.handlePlayer}
                      style={{display: 'flex', borderRadius: '50%', alignItems: 'center'}}
                    />
                  </Tooltip>}
                  <Spacer w={3}/>
                  <Tooltip text={'Details'}
                    placement="top" type="dark">
                    <Popover
                      content={this.getInfo()}
                      style={{display: 'flex', paddingRight: '5px', cursor: 'pointer'}}
                      placement="rightStart"
                      >
                      <Info size={36} />
                    </Popover>
                  </Tooltip>
                </Popover.Item>
                <Popover.Item style={{justifyContent: 'center'}}>
                  <Button auto icon={<Copy />} type="success" onClick={this.handleDuplicate} style={{width: '100%', height: '100%'}}>
                    Duplicate
                  </Button>
                </Popover.Item>
                <Popover.Item style={{justifyContent: 'center'}}>
                  <Button auto icon={<Trash2 />} type="error" onClick={this.handleDelete} style={{width: '100%', height: '100%'}}>
                    Delete
                  </Button>
                </Popover.Item>
                </>
              } style={{display: 'flex', cursor: 'pointer'}} disableItemsAutoClose>
              <MoreVertical />
            </Popover>
          </div>

          <div className="staged-layer-initials">
            <Badge.Anchor placement="bottomRight" className="staged-layer-initials">
              <Badge scale={0.1} type="warning">
                {this.props.layer.fileName === null ? 
                <Mic size={16} color="white"/> :
                <Music size={16} color="white"/>}
              </Badge>
              <Tag type="default" invert>{this.props.layer.member.firstname[0]}{this.props.layer.member.lastname[0]}</Tag>
            </Badge.Anchor>
          </div>
        </div>
      </div>
    )
  };
}

export default ComittedLayer;