<template>
  <div>TexToJson</div>
  <input type="file" @change="processFile" class="mt-4 mb-10" />
  <a id="downloadAnchorElem" style="display:none"></a>
</template>

<script lang="ts">
import { Choice, HTMLInputEvent, Question } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'TexToJson',
  methods: {
    processFile (event: HTMLInputEvent) {
      console.log(event.target?.files)
      const fileReader = new FileReader()
      fileReader.onload = e => {
        try {
          const content = e.target?.result as string //JSON.parse(e.target?.result as string)
          this.processContent(content)
        } catch (exception) {
          this.$store.commit('pushNotification', {
            message: `Errore nella lettura del file: ${exception}`,
            autoHide: 5000,
            severity: 2
          })
          throw exception
        }
      }

      fileReader.readAsText(event.target?.files?.item(0) as File)
    },
    shuffle (array) {
      let currentIndex = array.length,
        randomIndex

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex]
        ]
      }

      return array
    },
    processContent (input: string) {
      const problems = input.split(/\\newproblem[^\n]*\n/)
      console.log('problems', problems.length)

      const ret = [] as Question[]

      problems.forEach(problem => {
        if (!problem.length) {
          return
        }
        console.log('problem', problem)
        ///^\\item[^\n]*\n.*\\begin\{answers\}\{\d+\}\n.*\\bChoices\[random\]\n(.*)/

        const tokens = problem.split(
          /\\item(.*[^\\\n](?:\\\\\n.*[^\\\n])*)\n\s*\\begin\{answers\}\{\d+\}\n\s*\\bChoices\[random\]\n\s*(.*)/s
        )
        console.log('tokens', tokens)
        const newItem = {
          text: tokens[1].slice(1),
          choices: [] as Choice[]
        }
        console.log('answers', tokens)

        const answers = tokens[2].split(/\\Ans/)
        console.log('answers', answers)

        answers.forEach(answer => {
          if (!answer.length) {
            return
          }
          newItem.choices.push({
            text: /\\eChoices/.test(answer)
              ? answer.trim().slice(2, -43) //.slice(2, -33)
              : answer.trim().slice(2, -5), // slice(2, -6),
            correct: answer[0] === '1'
          } as Choice)
        })
        this.shuffle(newItem.choices) // shuffle choices
        ret.push(newItem as Question)
      })
      let asJson = JSON.stringify(ret, null, 2)

      asJson = asJson.replace(/\\\\D\s?/g, '').replace(/\\\\`e/g, 'è')

      var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(asJson)
      var dlAnchorElem = document.getElementById(
        'downloadAnchorElem'
      ) as HTMLElement
      dlAnchorElem.setAttribute('href', dataStr)
      dlAnchorElem.setAttribute('download', 'file.json')
      dlAnchorElem.click()
    }
  }
})
</script>

<style></style>
