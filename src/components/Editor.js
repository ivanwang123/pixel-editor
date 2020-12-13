import React, { Component } from 'react'
import {Play, Pause, PlusCircle, PlusSquare, Square} from 'react-feather';
import CanvasModal from './CanvasModal'

export class Editor extends Component {

    state = {
        canvasWidth: 10,
        canvasHeight: 10,
        pixelSize: 50,
        frames: [],
        curFrame: 0,
        playLoop: null,
        palette: ['#000', '#023', '#eee', '#fef'],
        fps: 12,
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        mouseDown: -1,
    }
    
    constructor(props) {
        super(props)
        
        this.primaryRef = React.createRef()
        this.secondaryRef = React.createRef()
        this.paletteRef = React.createRef()
        this.canvasRef = React.createRef()
        this.canvasContainerRef = React.createRef()
    }
    
    componentDidMount() {
        this.setPixelSize(this.state.canvasWidth, this.state.canvasHeight)
        let newCanvas = []
        for (let r = 0; r < this.state.canvasHeight; r++) {
            let newRow = []
            for (let c = 0; c < this.state.canvasWidth; c++) {
                newRow.push('#ffffff')
            }
            newCanvas.push(newRow)
        }
        this.setState({
            frames: [...this.state.frames, newCanvas]
        })

        window.addEventListener('mousedown', (e) => {
            e.preventDefault()
            this.setState({
                mouseDown: e.button
            })
        })
        window.addEventListener('mouseup', (e) => {
            this.setState({
                mouseDown: -1
            })
        })
        
        window.addEventListener('keypress', (e) => {
            const key = parseInt(e.key)
            if (key) {
                if (key !== 0 && key-1 < this.state.palette.length)
                    this.changeColorPalette(null, 0, this.state.palette[key-1])
            }
        })

        window.addEventListener('resize', (e) => {
            this.setPixelSize(this.state.canvasHeight, this.state.canvasWidth)
        })
    }

    setPixelSize = (canvasWidth, canvasHeight) => {
        const {width, height} = this.canvasContainerRef.current.getBoundingClientRect()
        const pixelWidth = width / canvasWidth
        const pixelHeight = height / canvasHeight

        if (pixelWidth < pixelHeight)
            this.setState({
                pixelSize: Math.round(pixelWidth)
            })
        else
            this.setState({
                pixelSize: Math.round(pixelHeight)
            })

        this.openFrame(null, this.state.curFrame)
    }

    changeColor = (e, pen) => {
        if (pen === 'primary') {
            this.setState({
                primaryColor: e.target.value
            })
            this.primaryRef.current.style.background = e.target.value
        } else if (pen === 'secondary') {
            this.setState({
                secondaryColor: e.target.value
            })
            this.secondaryRef.current.style.background = e.target.value
        }
    }

    changeColorPalette = (e, button, color) => {
        if (e)
            e.preventDefault()

        if (button === 0) {
            this.setState({
                primaryColor: color
            })
            this.primaryRef.current.style.background = color
        } else if (button === 2) {
            this.setState({
                secondaryColor: color
            })
            this.secondaryRef.current.style.background = color
        }
    }   

    addFrame = (e) => {
        let newCanvas = []
        for (let r = 0; r < this.state.canvasHeight; r++) {
            let newRow = []
            for (let c = 0; c < this.state.canvasWidth; c++) {
                newRow.push('#ffffff')
            }
            newCanvas.push(newRow)
        }

        this.setState({
            curFrame: this.state.frames.length
        })
        this.setState({
            frames: [...this.state.frames, newCanvas]
        })

        const ctx = this.canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height)
    }

    openFrame = (e, frameIndex) => {
        this.setState({
            curFrame: frameIndex
        })
        
        const ctx = this.canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height)
        
        const frame = this.state.frames[frameIndex]
        if (frame)
            for (let r = 0; r < frame.length; r++) {
                for (let c = 0; c < frame[r].length; c++) {
                    ctx.beginPath();
                    ctx.fillStyle = frame[r][c];
                    ctx.fillRect(c*this.state.pixelSize, r*this.state.pixelSize, this.state.pixelSize+1, this.state.pixelSize+1);
                    ctx.stroke();
                }
            }
    }

    play = (e) => {
        if (!this.state.playLoop) {
            const ctx = this.canvasRef.current.getContext('2d')
            const loop = setInterval(() => {
                const frame = this.state.frames[this.state.curFrame]

                for (let r = 0; r < frame.length; r++) {
                    for (let c = 0; c < frame[r].length; c++) {
                        ctx.beginPath();
                        ctx.fillStyle = frame[r][c];
                        ctx.fillRect(c*this.state.pixelSize, r*this.state.pixelSize, this.state.pixelSize, this.state.pixelSize);
                        ctx.stroke();
                    }
                }

                this.setState({
                    curFrame: (this.state.curFrame+1)%this.state.frames.length
                })
            }, 1000/this.state.fps)

            this.setState({
                playLoop: loop
            })
        }
    }

    pause = (e) => {
        clearInterval(this.state.playLoop)
        this.setState({
            playLoop: null
        })
    }

    addPaletteColor = (e) => {
        this.setState({
            palette: [...this.state.palette, '#000000']
        })
        this.paletteRef.current.click()
    }

    newColorPalette = (e) => {
        let newPalette = [...this.state.palette]
        newPalette[this.state.palette.length-1] = e.target.value
        this.setState({
            palette: newPalette
        })
    }

    colorCanvas = (e, button) => {
        e.preventDefault()
        const c = Math.floor((e.clientX-e.target.getBoundingClientRect().x) / this.state.pixelSize)
        const r = Math.floor((e.clientY-e.target.getBoundingClientRect().y) / this.state.pixelSize)

        let newFrames = [...this.state.frames]

        const ctx = this.canvasRef.current.getContext('2d')

        ctx.beginPath()
        if (button === 0) {
            ctx.fillStyle = this.state.primaryColor;
            newFrames[this.state.curFrame][r][c] = this.state.primaryColor
        } else if (button === 2) {
            ctx.fillStyle = this.state.secondaryColor;
            newFrames[this.state.curFrame][r][c] = this.state.secondaryColor
        }

        this.setState({
            frames: newFrames
        })

        ctx.fillRect(c*this.state.pixelSize, r*this.state.pixelSize, this.state.pixelSize, this.state.pixelSize)
        ctx.stroke();
    }

    newCanvas = (width, height, fps) => {
        let newCanvas = []
        for (let r = 0; r < height; r++) {
            let newRow = []
            for (let c = 0; c < width; c++) {
                newRow.push('#ffffff')
            }
            newCanvas.push(newRow)
        }

        this.setState({
            canvasWidth: width,
            canvasHeight: height,
            frames: [newCanvas],
            curFrame: 0,
            playLoop: null,
            palette: [],
            fps: fps,
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            mouseDown: -1,
        })
        
        this.setPixelSize(width, height)
    }

    render() {
        return (
            <div className="editor-container">
                <div className="frames-container">
                    <h1 className="display-4">PIX</h1>
                    <CanvasModal newCanvas={this.newCanvas} />
                    <div className="d-flex justify-content-center anim-controls">
                        <Play className="icon-btn" size="32" color={this.state.playLoop ? '#F2AE43' : 'black'} onClick={this.play} />
                        <Pause className="icon-btn" size="32" color={this.state.playLoop ? 'black' : '#F2AE43'} onClick={this.pause} />
                    </div>
                    <div className="frames-scroll">
                        {this.state.frames.map((frame, frameIndex) => {
                            return (
                                <div className="frame-preview">
                                    <Square size="180" strokeWidth="1" color={frameIndex === this.state.curFrame ? '#F2AE43' : 'black'} onClick={(e) => this.openFrame(e, frameIndex)} />
                                </div>
                            )
                        })}
                        <div className="frame-preview">
                            <PlusSquare className="icon-btn" strokeWidth="1" size="160" onClick={this.addFrame} />

                        </div>

                    </div>
                </div>


                <div className="palette-container d-flex flex-column">
                    <div className="d-flex">
                        <div ref={this.primaryRef} className="color-picker-container" style={{background: this.state.primaryColor}}>
                            <input className="color-picker" type="color" defaultValue={this.primaryColor} onChange={(e)=>this.changeColor(e, 'primary')} />
                        </div>
                        <div ref={this.secondaryRef} className="color-picker-container" style={{background: this.state.secondaryColor}}>
                            <input className="color-picker" type="color" defaultValue={this.secondaryColor} onChange={(e)=>this.changeColor(e, 'secondary')} />
                        </div>
                    </div>

                    <div className="palette-color-container">
                        {this.state.palette.map(color => {
                            return(
                                <div className="palette-color icon-btn mt-2" onContextMenu={(e) => this.changeColorPalette(e, 2, color)} onClick={(e) => this.changeColorPalette(e, 0, color)} style={{background: color}}></div>
                            )
                        })}

                        <div className="palette-picker-container">
                            <input ref={this.paletteRef} className="color-picker" type="color" defaultValue="#000000" onChange={this.newColorPalette} />
                            <PlusCircle className="icon-btn palette-picker mt-2" size="70" onClick={this.addPaletteColor} />
                        </div>
                    </div>
                </div>


                <div ref={this.canvasContainerRef} className="canvas-container">
                    <canvas ref={this.canvasRef} width={this.state.canvasWidth*this.state.pixelSize} height={this.state.canvasHeight*this.state.pixelSize} style={{background:'#ffffff', border: '1px solid #000'}} onMouseMove={this.state.mouseDown >= 0 ? (e)=>this.colorCanvas(e, this.state.mouseDown) : null} onClick={(e)=>this.colorCanvas(e, 0)} onContextMenu={(e)=>this.colorCanvas(e, 2)}></canvas>
                </div>
            </div>
        )
    }
}

export default Editor
