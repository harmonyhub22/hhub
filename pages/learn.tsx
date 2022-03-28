import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { Page, Text, Divider, Link, Grid, Card } from "@geist-ui/core";

const Learn = () => {
  const Router = useRouter();
  return (
    <>
    <Navbar />
    <Page>
      <Text h1>Learn Music Theory</Text>
      <Text h4>Looking to learn what things mean? We got your back!</Text>

      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Tempo</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              Tempo is the underlying speed, or beat, of the song. This is what keeps your song together so that 
              it has structure. It is what plays in the background as you add to your song. All of the song  
              sessions you have been a part of on Harmony Hub had a BPM (beats per minute) of 130. Sometimes, 
              depending on the genre, songs can change tempo. One genre where this happens a lot is classical 
              music.
            </Text>
            <Link href="https://www.masterclass.com/articles/music-101-what-is-tempo-how-is-tempo-used-in-music#what-is-tempo" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Measure</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              A measure to a song is like a sentence to a book. It is a chunk of the song that usually 
              holds music for 4 beats of the song. The time signature changes how many beats are in a measure. 
              Usually, an even number of measures (usually 4 or 16) makes up a meaningful part of the song. 
              For example, a chorus of a song could have 32 measures.
            </Text>
            <Link href="https://hiphopmakers.com/what-is-a-measure-in-music" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Time Signature</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              Time signature is how instruments and musicians stay together during a song. It consists of 2 numbers: 
              how many beats there are per measure and how we count the beat. In music, there are different kinds of 
              notes. There are whole notes (notes that last a whole measure), half notes (half as long as whole notes), 
              quarter notes (half as long as half notes), and eighth notes (you get the idea). Lets say a time signature 
              is 2/4. This means there are 2 beats per measure, and the beats are counted in quarter notes. What about 
              6/8? This would be 6 beats per measure, and we would count in eighth notes!
            </Text>
            <Link href="https://www.libertyparkmusic.com/musical-time-signatures/" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Rhythm</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              The rhythm is how the notes of a song are played. Notes are always arranged a certain way 
              in a song, with different lengths. This is rhythm. There a bunch of different ways to arrange 
              notes and count the beats in a song. Click the link below to learn more about these!
            </Text>
            <Link href="https://blog.landr.com/what-is-rhythm-time-beat-meter/" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Pitch</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              Pitch brings us right down to the molecular level of sounds! When you hit something, anything, it makes 
              a sound. This sound is represented as a wave that our ears pick up. This is the pitch. Your typical 
              object wont really make any certain clear, good-sounding pitch, but many of the musical instruments 
              out there, such as the flute, trumpet, violin, and sounds from all of the online music studios out 
              there, all have well-defined pitches. When a musician blows into their trumpet, they play a note.
              The notes that most musical instruments can play are 
              C, D, E, F, G, A, and B. There are also sharps for these notes (i.e. C# (C sharp), D# (D sharp), etc.).
            </Text>
            <Link href="https://hellomusictheory.com/learn/pitch/" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Melody</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              A songs melody is a combination of the notes&apos pitches and rhythm. Think of that Twinkle Twinkle Little Star 
              that you heard as a kid. Remember how it goes? You can probably hum it despite that you forgot much 
              of the lyrics (lyrics are the words that are said in the song). As you hum the notes, you are humming 
              the melody!
            </Text>
            <Link href="https://online.berklee.edu/takenote/melody-some-basics/" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Harmony</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              The first word of this app!! All songs seek to have harmony. Harmony occurs when 
              the notes, lyrics, beats, and...well, vibes of the song all line up perfectly together 
              to give you those sweet, sweet goosebumps. Harmony can happen when what are called 
              chords (certain combinations of notes) are played together, singers compliment each 
              other, or when the rhythm of the notes go nicely with the beat.
            </Text>
            <Link href="https://www.masterclass.com/articles/music-101-what-is-harmony-and-how-is-it-used-in-music#how-is-harmony-represented-in-music" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Key Signature</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              Key signatures tell us what the main notes (pitches) will be used in a song. They are 
              also a way to notate flats/sharps in sheet music. Each possible note you can play on an 
              instrument has its own key signature (isnt that neat?!). The key signature for C consists 
              of all non-sharp notes (just white keys on a piano), but key signatures for other notes 
              involves several sharp notes.
            </Text>
            <Link href="https://www.skoove.com/blog/key-signatures-beginners-guide/" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
      <br/>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <br/>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Card shadow width="100%" height="100%">
            <Text h2>Dynamics</Text>
          </Card>
        </Grid>
        <Grid xs={18}>
          <Card shadow width="100%" height="100%">
            <Text>
              The dynamics in a song tell us how loudly the notes are played. We use fancy-sounding 
              words to denote the different volumes: forte is loud, piano is quiet, and mezzo is medium
              (but there are other, more specific volumes centered around these 3 main ones). Often times, 
              notes will progressively go from piano to forte, or vice versa. Dynamics add cool effects 
              and richness to a song. In Harmony Hub, you can face your layers in and out. If you fade a 
              layer in, it will get slowly louder, and if you fade it out, it will get quieter. One great 
              spot to add these effects is at the beginning and ending of your songs!
            </Text>
            <Link href="https://hellomusictheory.com/learn/dynamics/" target="_blank" icon color>Learn more</Link>
          </Card>
        </Grid>
      </Grid.Container>
    </Page>
    </>
  );
};

export default Learn;
