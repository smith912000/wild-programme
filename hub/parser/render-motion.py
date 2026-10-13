import numpy as np, subprocess, sys
TAU=2*np.pi
def enc(name,W,H,fps,frames,crf):
    p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-',
      '-c:v','libx264','-preset','slow','-crf',str(crf),'-pix_fmt','yuv420p','-movflags','+faststart','-an',name],stdin=subprocess.PIPE)
    for f in frames: p.stdin.write(f.tobytes())
    p.stdin.close(); p.wait()
def glow(X,Y,cx,cy,rx,ry): return np.exp(-(((X-cx)/rx)**2+((Y-cy)/ry)**2))
def ring(D,r,w): return np.exp(-((D-r)/w)**2)
BG=np.array([5,3,9],float); IND=np.array([99,73,184],float); IND2=np.array([138,111,224],float); GOLD=np.array([201,168,76],float); GOLD2=np.array([233,199,102],float)

def ambient():
    W,H,fps,T=960,540,24,12; N=fps*T
    y,x=np.mgrid[0:H,0:W].astype(float); X=x/H; Y=y/H; cx=W/H/2; cy=.5
    rng=np.random.default_rng(7); S=140
    sx=rng.uniform(0,W/H,S); sy=rng.uniform(0,1,S); sp=rng.uniform(0,TAU,S); sk=rng.integers(1,3,S); sb=rng.uniform(.25,.8,S)
    for i in range(N):
        t=i/N; a=TAU*t
        img=np.zeros((H,W,3))+BG
        img+=IND[None,None]*(.30*glow(X,Y,.35+.08*np.cos(a),.15+.06*np.sin(a),.75,.55))[...,None]
        img+=IND2[None,None]*(.12*glow(X,Y,1.45+.07*np.sin(a),.85+.05*np.cos(a),.6,.5))[...,None]
        img+=GOLD[None,None]*(.06*glow(X,Y,cx,cy,.22+.03*np.sin(a),.3))[...,None]
        # breathing vesica
        br=1+.025*np.sin(a*2); r=.17*br
        D1=np.hypot(X-cx,Y-(cy-.085)); D2=np.hypot(X-cx,Y-(cy+.085))
        v=(ring(D1,r,.0022)+ring(D2,r,.0022))*(.22+.06*np.sin(a*2))
        img+=IND2[None,None]*v[...,None]
        # 78-point orbit, rotates one step per loop so it is seamless
        k=78; ang=np.arange(k)/k*TAU+a/k; R=.34
        for j,th in enumerate(ang):
            px,py=cx+R*np.cos(th),cy+R*.62*np.sin(th)
            x0,x1=int(px*H)-6,int(px*H)+7; y0,y1=int(py*H)-6,int(py*H)+7
            sub=np.exp(-(((x[y0:y1,x0:x1]/H-px)**2+(y[y0:y1,x0:x1]/H-py)**2)/(.0026**2)))
            col=GOLD2 if j%13==0 else IND2
            img[y0:y1,x0:x1]+=col*sub[...,None]*(.55 if j%13==0 else .35)
        # stars twinkle on loop-periodic phase
        for j in range(S):
            b=sb[j]*(.5+.5*np.sin(a*sk[j]+sp[j]))**2
            xi,yi=int(sx[j]*H),int(sy[j]*H)
            if 0<xi<W-1 and 0<yi<H-1: img[yi,xi]+=255*b*.7; img[yi-1:yi+2,xi-1:xi+2]+=40*b
        yield np.clip(img,0,255).astype(np.uint8)

def aperture():
    S_,fps,T=720,30,2.2; N=int(fps*T)
    y,x=np.mgrid[0:S_,0:S_].astype(float)/S_; cx,cy=.5,.5
    D1=np.hypot(x-cx,y-(cy-.07)); D2=np.hypot(x-cx,y-(cy+.07))
    A1=(np.arctan2(y-(cy-.07),x-cx)+TAU*1.25)%TAU; A2=(np.arctan2(y-(cy+.07),x-cx)+TAU*.75)%TAU
    r=.14
    for i in range(N):
        t=i/(N-1)
        img=np.zeros((S_,S_,3))
        draw=min(1,t/.45); e=1-(1-draw)**3
        m1=(A1<=e*TAU); m2=(A2<=e*TAU)
        fade=1 if t<.75 else max(0,1-(t-.75)/.25)
        v=(ring(D1,r,.004)*m1+ring(D2,r,.004)*m2)*fade
        img+=IND2*v[...,None]*1.1
        img+=IND*(glow(x,y,cx,cy,.3,.3)*.35*e*fade)[...,None]
        # gold aperture line grows, then opens into light
        g=max(0,min(1,(t-.35)/.25)); L=.075*g
        line=np.exp(-((x-cx)/.006)**2)*(np.abs(y-cy)<=L)
        img+=GOLD2*(line*1.2*fade)[...,None]
        o=max(0,(t-.6)/.4); 
        if o>0:
            rad=.02+.7*o**1.4; inten=(1-o)**1.5
            img+=GOLD2*(np.exp(-((np.hypot(x-cx,y-cy))/rad)**2)*inten*1.6)[...,None]
            img+=GOLD*(ring(np.hypot(x-cx,y-cy),rad*1.1,.01+.03*o)*inten*.8)[...,None]
        yield np.clip(img,0,255).astype(np.uint8)

enc('parser-ambient.mp4',960,540,24,ambient(),30)
enc('parser-aperture.mp4',720,720,30,aperture(),28)
