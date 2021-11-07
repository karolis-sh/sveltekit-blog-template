<script>
  import { format } from 'date-fns';

  export let date;
  export let readingTime;
</script>

<time datetime={date}>{format(new Date(date), 'MMMM d, yyyy')}</time>
•
<span>{readingTime.text}</span>
