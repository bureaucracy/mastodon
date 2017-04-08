extends 'activitypub/types/person.activitystreams2.rabl'

object @account

attributes display_name: :name, username: :preferredUsername, note: :summary
