amp = 1
# namespace for static values
dom =
	# dom objects
	txt_char: $ '#text'
	txt_frec: $ '#amp'	
	txt_amp: $ '#amp'
	txt_code: $ '#code'
	cb_codes: $ '#combo'
	box_debg: $ '.debug'
	ico_load: $ '.load'
	inputs: $ '	input'
	graph: $ '#graph'
	graph_line_code: $ '#graph_line_code'
	numbers: $ '.number'


# valide functions
valide =
	bin: (event)->
		if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39) or event.keyCode is 110
			return true
		else if (event.keyCode < 48 or event.keyCode > 49) and (event.keyCode < 96 or event.keyCode > 105)
			event.preventDefault()

# namespace
node =

	# init function
	init: ()->
		dom.numbers.on 'keydown', (event)->
			valide.bin event
		dom.txt_char.on 'keyup', () =>
			this._change()
		dom.txt_amp.on 'keyup change', () =>
			this._change()			
		dom.cb_codes.on 'change', () =>
			this._change()
		dom.txt_code.text dom.cb_codes.val()
		# enable all fields (inputs)
		dom.inputs.prop 'disabled', false
		dom.ico_load.remove()
		$('header, div, footer').removeClass 'hide'

	# change for text, here is the magic :)
	_change: ()->
		amp = parseInt(dom.txt_amp.val()) || 1
		char = dom.txt_char.val()
		dom.txt_code.text dom.cb_codes.val()
		new_char = []
		for i in [0..char.length-1]
			new_char.push parseInt char[i]
		if new_char.length > 0
			this._plot new_char
			switch dom.cb_codes.val()
				when "adi" then this._plot_code_line(code.adi(new_char))
				when "ami" then this._plot_code_line(code.ami(new_char))
				when "cmi" then this._plot_code_line(code.cmi(new_char))
				when "manchester" then this._plot_code_line(code.manchester(new_char))
				when "b8zs" then this._plot_code_line(code.b8zs(new_char))
				when "hdb3" then this._plot_code_line(code.hdb3(new_char))
			

	_plot: (val) ->
		console.log amp
		points = []
		for x in [0..val.length] by val.length/300
			points.push([x, val[parseInt(x)]*amp])
		$.plot(dom.graph, [points])

	_plot_code_line: (val) ->
		console.log amp
		points = []
		if dom.cb_codes.val() == "cmi" or dom.cb_codes.val() == "manchester"
			for x in [0..val.length] by val.length/300

				points.push([x, val[parseInt(x)]*amp])
		else
			for x in [0..val.length] by val.length/300
				points.push([x, val[parseInt(x)]*amp])
		$.plot(dom.graph_line_code, [points])

# code lines
code =

	adi: (char) ->
		adi = []
		for i in [0..char.length-1]
			adi.push char[i]
		for i in [1..adi.length-1] by 2
			adi[i] = if adi[i] == 1 then 0 else 1
		return adi

	ami: (char) ->
		adi = []
		flag = false
		for i in [0..char.length-1]
			adi.push char[i]
		for i in [1..adi.length-1]
			if adi[i] != 0
				if flag
					adi[i] = 1
					flag = false
				else
					adi[i] = -1
					flag = true
		return adi

	cmi: (char) ->
		adi = []
		flag = true
		for i in [0..char.length-1]
			if char[i] == 0
				adi.push 0
				adi.push 1
			else
				if flag
					adi.push 1
					adi.push 1
					flag = false
				else
					adi.push 0
					adi.push 0
					flag = true
		return adi

	manchester: (char) ->
		adi = []
		for i in [0..char.length-1]
			if char[i] == 0
				adi.push 1
				adi.push -1
			else
				adi.push -1
				adi.push 1
		return adi


	b8zs: (char) ->
		ami = this.ami char
		for i in [0..ami.length-9]
			if ami[i] == 0 and ami[i+1] == 0 and ami[i+2] == 0 and ami[i+3] == 0 and ami[i+4] == 0 and ami[i+5] == 0 and ami[i+6] == 0 and ami[i+7] == 0
				try
					if ami[i-1] == 1 or ami[i-1] == 1
						ami[i+3] = 1
						ami[i+4] = -1
						ami[i+6] = -1
						ami[i+7] = 1
						i+=7
					else if ami[i-1] == -1
						ami[i+3] = -1
						ami[i+4] = 1
						ami[i+6] = 1
						ami[i+7] = -1
						i+=7
				catch error
		return ami

	hdb3: (char) ->
		ami = this.ami char
		for i in [0..ami.length-4]
			if ami[i] == 0 and ami[i+1] == 0 and ami[i+2] == 0 and ami[i+3] == 0
				try
					if ami[i-1] == 1 or ami[i-1] == 1
						ami[i] = -1
						ami[i+1] = 0
						ami[i+2] = 0
						ami[i+3] = -1
						i+=3
					else if ami[i-1] == -1
						ami[i] = 1
						ami[i+1] = 0
						ami[i+2] = 0
						ami[i+3] = 1
						i+=3
				catch error
		return ami

$ ()->
	node.init()