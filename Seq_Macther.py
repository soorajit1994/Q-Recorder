import difflib
s1=["delay=0s","animation-direction=normal","animation-duration=0s","animation-fill-mode=none"]
s2=["delay=0s","animation-direction=normal"]
sm=difflib.SequenceMatcher(None,s1,s2)
print(sm.ratio())
